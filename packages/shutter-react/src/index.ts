import { createShutter } from '@andywer/shutter'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const defaultRender = (element: ReactElement<any>): Promise<HTMLString> => {
  return Promise.resolve(renderToStaticMarkup(element))
}

export function createReactShutter (testDirPath: string, options: Options = {}): ReactShutterInstance {
  const {
    render = defaultRender
  } = options

  const shutter = createShutter(testDirPath, options)

  return {
    ...shutter,

    async snapshot (testName: string, element: ReactElement<any>) {
      const html: HTMLString = await render(element, defaultRender)
      return shutter.snapshot(testName, html)
    }
  } as any as ReactShutterInstance    // tslint:disable-line
}

export type Options = {
  // Custom renderer, taking some HTML content snippet and returning a complete HTML document
  // Defaults to looking for a custom layout file, falling back to a generic layout otherwise
  layout?: (content: HTMLString) => HTMLString,

  // Custom function to determine the port to use for the server
  // Defaults to using a random unused port
  getPort?: () => Promise<number>,

  // Custom threshold when to call it a mismatch. `0.01` means "if more than 1% of all pixels mismatch".
  // Defaults to 0.01%
  relativeThreshold?: number,

  // Path to directory where current run's snapshots and diffs will be saved
  // Defaults to `${testDirPath}/.last-run`
  lastRunPath?: string,

  // Custom component renderer, receives the default renderer as second parameter, so it can use it
  // Defaults to just rendering the React component to static HTML
  render?: (reactElement: ReactElement<any>, originalRender: (reactElement: ReactElement<any>) => Promise<HTMLString>) => Promise<HTMLString>,

  // Path to directory where snapshots (the test expectations) will be saved
  // Defaults to `${testDirPath}/snapshots`
  snapshotsPath?: string
}

export type HTMLString = string

export interface ReactShutterInstance {
  snapshot (testName: string, reactElement: ReactElement<any>): Promise<void>
  serveDirectory (dirPathOnDisk: string): this
}
