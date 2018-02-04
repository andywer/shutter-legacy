const React = require('react')
const { createReactShutter } = require('../dist/index')

const shutter = createReactShutter(__dirname)

const MyButton = ({ label }) => React.createElement('button', { className: 'my-button' }, label)

;(async () => {
  await shutter.snapshot('Render button', React.createElement(MyButton, { label: 'Click me' }))
})()
.catch(error => console.error(error.stack || error))
.then(() => console.log('Done'))
