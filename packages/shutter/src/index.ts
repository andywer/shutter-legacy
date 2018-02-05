import defaultGetPort = require('get-port')
import kebabCase = require('dashify')
import createDebugLogger = require('debug')
import minimist = require('minimist')
import * as path from 'path'
import * as puppeteer from 'puppeteer'
import defaultLayout from './layout'
import { createServer, Server } from './server'
import snapshot from './snapshot'

const debugLogForServer = createDebugLogger('shutter:server')

export function createShutter (testDirPath: string, options: Options = {}): ShutterInstance {
  const {
    getPort = defaultGetPort,
    layout = defaultLayout,
    lastRunPath = path.join(testDirPath, '.last-run'),
    snapshotsPath = path.join(testDirPath, 'snapshots')
  } = options

  const argv = minimist(process.argv.slice(2))
  const updateSnapshots = argv['update-snapshots']

  const directoriesToServe: string[] = []

  return {
    async snapshot (testName: string, html: HTMLString) {
      const [ browser, server ] = await Promise.all([
        puppeteer.launch(),
        getPort().then(port => createServer({ port }))
      ]) as any as [ puppeteer.Browser, Server ]

      try {
        directoriesToServe.forEach(dirPath => server.serveDirectory(dirPath))
        const snapshotID = kebabCase(testName)
        // TODO: Warn or throw if snapshotID is used in different snapshot() calls

        const documentHTML = layout(html)
        const serveOnPath = `/shutter-${snapshotID}`

        debugLogForServer(`Serving HTML to snapshot at http://localhost:${server.port}${serveOnPath}`)
        server.serveDocument(documentHTML, serveOnPath)

        await snapshot(snapshotID, browser, `http://localhost:${server.port}${serveOnPath}`, {
          lastRunPath,
          snapshotsPath,
          testName,
          updateSnapshot: updateSnapshots
        })
      } finally {
        await Promise.all([
          browser.close(),
          server.close()
        ])
      }
    },
    serveDirectory (dirPathOnDisk: string) {
      directoriesToServe.push(dirPathOnDisk)
      return this
    }
  }
}

export type Options = {
  // Custom renderer, taking some HTML content snippet and returning a complete HTML document
  // Defaults to looking for a custom layout file, falling back to a generic layout otherwise
  layout?: (content: HTMLString) => HTMLString,

  // Custom function to determine the port to use for the server
  // Defaults to using a random unused port
  getPort?: () => Promise<number>,

  // Path to directory where current run's snapshots and diffs will be saved
  // Defaults to `${testDirPath}/.last-run`
  lastRunPath?: string,

  // Path to directory where snapshots (the test expectations) will be saved
  // Defaults to `${testDirPath}/snapshots`
  snapshotsPath?: string
}

export type HTMLString = string

export interface ShutterInstance {
  snapshot (testName: string, html: HTMLString): Promise<void>
  serveDirectory (dirPathOnDisk: string): this
}
