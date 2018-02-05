import test from 'ava'
import { createShutter } from '@andywer/shutter'

const layout = ({ content }: { content: string }) => `
<!doctype html>
<html>
  <head>
    <link rel='stylesheet' href='/shutter-plain-css.css' />
  </head>
  <body>
    ${content}
  </body>
</html>
`
const shutter = createShutter(__dirname, { layout }).serveDirectory(__dirname)

test('Button with CSS', async t => {
  await shutter.snapshot('Button with CSS', '<button>Click me</button>')
  t.pass()
})
