import * as fs from 'mz/fs'
import * as path from 'path'
import { PNG } from 'pngjs'

const fileOrDirectoryExists = async (path: string) => {
  try {
    await fs.access(path, fs.constants.R_OK)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false
    } else {
      throw error
    }
  }
}

const mkdirIfMissing = async (path: string) => {
  if (!await fileOrDirectoryExists(path)) {
    await fs.mkdir(path)
  }
}

const writeStream = async (path: string, stream: PNG) => {
  return new Promise(resolve => {
    const outStream = fs.createWriteStream(path)
    stream.pipe(outStream)
    stream.on('end', () => resolve())
  })
}

export function bindSnapshotFileFunctions ({ lastRunPath, snapshotsPath }: Options) {
  const snapshotPath = (snapshotID: string) => path.join(snapshotsPath, `${snapshotID}.png`)
  const resultPath = (snapshotID: string) => path.join(lastRunPath, snapshotID)

  return {
    async snapshotExists (snapshotID: string): Promise<boolean> {
      return fileOrDirectoryExists(snapshotPath(snapshotID))
    },

    async saveSnapshot (snapshotID: string, png: PNG) {
      await mkdirIfMissing(snapshotsPath)
      return writeStream(snapshotPath(snapshotID), png.pack())
    },

    async loadSnapshot (snapshotID: string): Promise<Buffer> {
      return fs.readFile(snapshotPath(snapshotID))
    },

    async saveResults (snapshotID: string, expectedPNG: PNG, actualPNG: PNG, diffPNG: PNG, htmlContent: string) {
      const thisResultsPath = resultPath(snapshotID)

      await mkdirIfMissing(lastRunPath)
      await mkdirIfMissing(thisResultsPath)

      await Promise.all([
        writeStream(path.join(thisResultsPath, `actual.png`), actualPNG.pack()),
        writeStream(path.join(thisResultsPath, `expected.png`), expectedPNG.pack()),
        writeStream(path.join(thisResultsPath, `diff.png`), diffPNG.pack()),
        fs.writeFile(path.join(thisResultsPath, 'index.html'), htmlContent, 'utf-8')
      ])

      return thisResultsPath
    }
  }
}

export type Options = {
  lastRunPath: string,
  snapshotsPath: string
}
