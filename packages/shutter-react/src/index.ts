import { createShutter } from '@andywer/shutter'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export function createReactShutter (testDirPath: string, options: Options = {}): ReactShutterInstance {
  const shutter = createShutter(testDirPath, options)
  return {
    ...shutter,

    async snapshot (testName: string, element: ReactElement<any>) {
      const html: HTMLString = renderToStaticMarkup(element)
      return shutter.snapshot(testName, html)
    }
  }
}

export type Options = {
  // Custom renderer, taking some HTML content snippet and returning a complete HTML document
  // Defaults to looking for a custom layout file, falling back to a generic layout otherwise
  layout?: (page: { content: HTMLString }) => HTMLString,

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

export interface ReactShutterInstance {
  snapshot (testName: string, reactElement: ReactElement<any>): Promise<void>
  serveDirectory (dirPathOnDisk: string): Promise<void>
}
