import test from 'ava'
import { createShutter } from '@andywer/shutter'

const shutter = createShutter(__dirname)

test('Button', async t => {
  await shutter.snapshot('Render button', '<button>Click me</button>')
  t.pass()
})
