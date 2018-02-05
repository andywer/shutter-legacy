import test from 'ava'
import * as React from 'react'
import { createReactShutter } from '@andywer/shutter-react'

const shutter = createReactShutter(__dirname)

const MyButton = (props: { label: string }) => (
  <button className='my-button'>{props.label}</button>
)

test('Button', async t => {
  await shutter.snapshot('MyButton', <MyButton label='Click me' />)
  t.pass()
})
