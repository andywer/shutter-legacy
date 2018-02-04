# Idea

```tsx
import test from 'ava'
import { createShutter } from 'shutter'
import { createReactShutter } from '@shutter/react'

const shutter = createShutter(__dirname)
const reactShutter = createReactShutter(__dirname)

const MyButton = ({ label }) => <button>{label}</button>

test('Button in default state', async t => {
  await reactShutter.snapshot('Button in default state', <MyButton label='Click me' />)
  t.pass()
})

test('Button in default state', async t => {
  await shutter.snapshot('Button in default state', `<button>Click me</button>`)
  t.pass()
})
```


## createShutter()

```ts
declare function createShutter (options: Options = {}): ShutterInstance

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

type HTMLString = string
```

## CLI parameters

Shutter will also parse command line parameters and update snapshots if `--update-snapshots` is set.
