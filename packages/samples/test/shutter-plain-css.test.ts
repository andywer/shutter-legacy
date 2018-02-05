import test from 'ava'
import * as path from 'path'
import { createShutter } from '@andywer/shutter'
import loadEJSLayout from './helpers/ejs-layout'

const layout = loadEJSLayout(path.join(__dirname, 'shutter-plain-css.ejs'))
const shutter = createShutter(__dirname, { layout }).serveDirectory(__dirname)

test('Button with CSS', async t => {
  await shutter.snapshot('Button with CSS', '<button>Click me</button>')
  t.pass()
})
