import { ReactElement } from 'react'
import { ServerStyleSheet } from 'styled-components'

const render = async (element: ReactElement<any>, renderToString: (element: ReactElement<any>) => Promise<string>) => {
  const sheet = new ServerStyleSheet()
  const html = await renderToString(sheet.collectStyles(element))
  const styleTags = sheet.getStyleTags()
  return html + styleTags
}

export default render
