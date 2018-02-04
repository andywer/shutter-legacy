import { Browser } from 'puppeteer'
import { PNG } from 'pngjs'
import createDebugLogger = require('debug')
import pixelmatch = require('pixelmatch')
import { bindSnapshotFileFunctions } from './fs'

const debugLog = createDebugLogger('shutter:snapshot')

const pngFromBuffer = async (buffer: Buffer): Promise<PNG> => {
  return new Promise<PNG>((resolve, reject) => {
    const png = new PNG().parse(buffer, error => error ? reject(error) : resolve(png))
  })
}

export default async function snapshot (snapshotID: string, browser: Browser, servedOnURL: string, options: Options) {
  const { lastRunPath, snapshotsPath, updateSnapshot } = options
  debugLog(`Creating snapshot ${snapshotID}`)

  const { snapshotExists, saveSnapshot, loadSnapshot, saveResults } = bindSnapshotFileFunctions({ lastRunPath, snapshotsPath })
  const page = await browser.newPage()

  // Note: No viewport set

  try {
    await page.goto(servedOnURL)
    debugLog(`Taking screenshot`)
    const actualPNGBuffer = await page.screenshot({ omitBackground: true })
    const actualPNG = await pngFromBuffer(actualPNGBuffer)

    if (updateSnapshot || ! await snapshotExists(snapshotID)) {
      debugLog(`Updating snapshot on disk`)
      await saveSnapshot(snapshotID, actualPNGBuffer)
    } else {
      debugLog(`Using snapshot from disk as expected image`)
    }

    const expectedPNG = await pngFromBuffer(await loadSnapshot(snapshotID))
    debugLog(`Diffing images`)
    const { diff, match } = await diffPNGs(expectedPNG, actualPNG)

    debugLog(`Saving results`)
    const resultsPath = await saveResults(snapshotID, expectedPNG, actualPNG, diff)

    if (!match) {
      debugLog(`Rendered document ${snapshotID} does not match snapshot.`)
      // TODO: Throw better error
      throw new Error(`Screenshot does not match visual snapshot. See ${resultsPath}`)
    } else {
      debugLog(`Rendered document ${snapshotID} matches snapshot.`)
    }
  } finally {
    await page.close()
  }
}

export type Options = {
  lastRunPath: string,
  snapshotsPath: string,
  updateSnapshot: boolean
}

async function diffPNGs (expected: PNG, actual: PNG) {
  if (actual.width !== expected.width || actual.height !== expected.height) {
    // TODO: Autocrop both images (https://github.com/oliver-moran/jimp)
    // TODO: Make images same size
    throw new Error(`Image sizes do not match. Snapshot: ${expected.width}x${expected.height}. Acutal: ${actual.width}x${actual.height}`)
  }

  const diff = new PNG({ width: actual.width, height: actual.height })
  const mismatchedPixelsCount = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height)
  const relativeThreshold = 0.01

  debugLog(`Mismatching pixels: ${mismatchedPixelsCount} of ${actual.width * actual.height} pixels (${actual.width}x${actual.height} image)`)
  const match = mismatchedPixelsCount < actual.width * actual.height * relativeThreshold

  return {
    match,
    diff: diff
  }
}
