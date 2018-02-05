import * as fs from 'fs'
import * as ejs from 'ejs'

export type Layout = (content: string) => string

export default function loadEJSLayout (filePath: string): Layout {
  const ejsTemplate = fs.readFileSync(filePath, 'utf-8')
  const template = ejs.compile(ejsTemplate)
  return (content: string) => template({ content })
}
