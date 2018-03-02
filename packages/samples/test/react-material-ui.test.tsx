import test from 'ava'
import * as path from 'path'
import * as React from 'react'
import { createReactShutter } from '@andywer/shutter-react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import RaisedButton from 'material-ui/RaisedButton'
import loadEJSLayout from './helpers/ejs-layout'

const render = (element: React.ReactElement<any>, originalRender: (element: React.ReactElement<any>) => Promise<string>) => originalRender(
  <MuiThemeProvider muiTheme={getMuiTheme({}, { userAgent: false })}>
    {element}
  </MuiThemeProvider>
)

const layout = loadEJSLayout(path.join(__dirname, 'react-material-ui.ejs'))
const shutter = createReactShutter(__dirname, { layout, render })

const MyButton = (props: { label: string }) => (
  <button className='my-button'>{props.label}</button>
)

test('AppBar', async t => {
  await shutter.snapshot('AppBar', <AppBar title="Title" iconClassNameRight="muidocs-icon-navigation-expand-more" />)
  t.pass()
})

test('RaisedButton', async t => {
  await shutter.snapshot('RaisedButton default', <RaisedButton label="Default" />)
  await shutter.snapshot('RaisedButton primary', <RaisedButton label="Primary" primary />)
  await shutter.snapshot('RaisedButton secondary', <RaisedButton label="Secondary" secondary />)
  t.pass()
})
