import { PNG } from 'pngjs'
import * as Jimp from 'jimp'
import pixelmatch = require('pixelmatch')

export const pngFromBuffer = async (buffer: Buffer): Promise<PNG> => {
  return new Promise<PNG>((resolve, reject) => {
    const png = new PNG().parse(buffer, error => error ? reject(error) : resolve(png))
  })
}

const jimpImageToBuffer = async (image: Jimp): Promise<Buffer> => {
  return new Promise<Buffer>((resolve, reject) => {
    image.getBuffer('image/png', (error, buffer) => error ? reject(error) : resolve(buffer))
  })
}

const jimpImageToPNG = async (image: Jimp): Promise<PNG> => {
  const buffer = await new Promise<Buffer>((resolve, reject) => {
    image.getBuffer('image/png', (error, buffer) => error ? reject(error) : resolve(buffer))
  })
  return pngFromBuffer(buffer)
}

export async function diff (expected: PNG, actual: PNG) {
  if (actual.width !== expected.width || actual.height !== expected.height) {
    throw new Error(`Image sizes do not match. Snapshot: ${expected.width}x${expected.height}. Acutal: ${actual.width}x${actual.height}`)
  }

  const diff = new PNG({ width: actual.width, height: actual.height })
  const mismatchedPixels: number = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height)

  return {
    diff,
    mismatchedPixels,
    width: actual.width,
    height: actual.height
  }
}

export async function autoCrop (pngBuffer: Buffer): Promise<Buffer> {
  const image = (await Jimp.read(pngBuffer)).autocrop()
  return jimpImageToBuffer(image)
}

export async function autoCropToMatch (expectedPNGBuffer: Buffer, actualPNGBuffer: Buffer): Promise<PNG[]> {
  const [ procExpected, procActual ] = autocropAndMatchSizes(
    await Jimp.read(expectedPNGBuffer),
    await Jimp.read(actualPNGBuffer)
  )
  return Promise.all([
    jimpImageToPNG(procExpected),
    jimpImageToPNG(procActual)
  ])
}

function autocropAndMatchSizes (image1: Jimp, image2: Jimp): Jimp[] {
  const alignment = Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP

  image1 = image1.autocrop()
  image2 = image2.autocrop()

  if (image1.bitmap.width !== image2.bitmap.width || image1.bitmap.height !== image2.bitmap.height) {
    // Resize to match sizes
    const newWidth = Math.max(image1.bitmap.width, image2.bitmap.width)
    const newHeight = Math.max(image1.bitmap.height, image2.bitmap.height)
    image1 = image1.contain(newWidth, newHeight, alignment)
    image2 = image2.contain(newWidth, newHeight, alignment)
  }

  return [ image1, image2 ]
}
