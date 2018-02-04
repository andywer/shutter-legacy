const { createShutter } = require('../dist/index')

const shutter = createShutter(__dirname)

;(async () => {
  await shutter.snapshot('Render button', '<button>Click me</button>')
})()
.catch(error => console.error(error.stack || error))
.then(() => console.log('Done'))
