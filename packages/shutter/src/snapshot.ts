import { Browser } from 'puppeteer'
import { PNG } from 'pngjs'
import createDebugLogger = require('debug')
import { bindSnapshotFileFunctions } from './fs'
import { autoCrop, autoCropToMatch, diff as diffPNGs, pngFromBuffer } from './image'
import resultLayout from './layout-result'

const debugLog = createDebugLogger('shutter:snapshot')

export default async function snapshot (snapshotID: string, browser: Browser, servedOnURL: string, options: Options) {
  const { lastRunPath, snapshotsPath, testName, updateSnapshot } = options
  debugLog(`Creating snapshot ${snapshotID}`)

  const { snapshotExists, saveSnapshot, loadSnapshot, saveResults } = bindSnapshotFileFunctions({ lastRunPath, snapshotsPath })
  const page = await browser.newPage()

  // Note: No viewport set

  try {
    await page.goto(servedOnURL)
    debugLog(`Taking screenshot`)
    const actualPNGBuffer = await autoCrop(await page.screenshot({ omitBackground: true }))
    const actualPNG = await pngFromBuffer(actualPNGBuffer)

    if (updateSnapshot || ! await snapshotExists(snapshotID)) {
      debugLog(`Updating snapshot on disk`)
      await saveSnapshot(snapshotID, actualPNG)
    } else {
      debugLog(`Using snapshot from disk as expected image`)
    }

    const expectedPNGBuffer = await loadSnapshot(snapshotID)
    debugLog(`Diffing images`)
    const [ croppedExpected, croppedActual ] = await autoCropToMatch(expectedPNGBuffer, actualPNGBuffer)
    const { diff, mismatchedPixels, width, height } = await diffPNGs(croppedExpected, croppedActual)

    debugLog(`Mismatching pixels: ${mismatchedPixels} of ${width * height} pixels (${width}x${height} image)`)
    const relativeThreshold = 0.01

    debugLog(`Saving results`)
    const resultsPath = await saveResults(snapshotID, croppedExpected, croppedActual, diff, resultLayout({ testName }))

    if (mismatchedPixels >= width * height * relativeThreshold) {
      debugLog(`Rendered document ${snapshotID} does not match snapshot.`)
      // TODO: Throw better error
      throw new Error(`Screenshot does not match visual snapshot. See file://${resultsPath}/index.html`)
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
  testName: string,
  updateSnapshot: boolean
}
