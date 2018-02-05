import test from 'ava'
import * as React from 'react'
import { createReactShutter } from '@andywer/shutter-react'
import styled from 'styled-components'
import renderStyledComponent from './helpers/render-styled-components'

const Button = styled.button`
  background: rgb(219,112,147);
  color: white;
  padding: 8 16px;
`
const MyButton = (props: { label: string }) => (
  <Button className='my-button'>{props.label}</Button>
)

const shutter = createReactShutter(__dirname, { render: renderStyledComponent })

test('MyButton styled component', async t => {
  await shutter.snapshot('MyButton styled component', <MyButton label='Click me' />)
  t.pass()
})
