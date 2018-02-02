# Idea

```tsx
import test from 'ava'
import { createShutter } from 'shutter'
import { createReactShutter } from '@shutter/react'

const shutter = createShutter()
const reactShutter = createReactShutter()

const MyButton = ({ label }) => <button>{label}</button>

test('Button in default state', async t => {
  await reactShutter.snapshot(<MyButton label='Click me' />)
  t.pass()
})

test('Button in default state', async t => {
  await shutter.snapshot(`<button>Click me</button>`)
  t.pass()
})
```


## createShutter()

```ts
declare function createShutter (options: Options = {}): ShutterInstance

type Options = {
  // Custom renderer, taking some HTML content snippet and returning a complete HTML document
  // Defaults to looking for a custom layout file, falling back to a generic layout otherwise
  layout?: ({ content: HTMLString }) => HTMLString,

  // Path to directory where snapshots will be saved
  // Defaults to `${dirName(testFilePath)}/snapshots`
  snapshotsPath?: string,

  // Path to test file
  // Defaults to the file where createShutter() was called
  testFilePath?: string
}
type HTMLString = string
```

## CLI parameters

Shutter will also parse command line parameters and update snapshots if `--update-snapshots` is set.
