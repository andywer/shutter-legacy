const defaultLayout = (content: string) => `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Shutter Visual Snapshot Test</title>
  </head>
  <body>
    ${content}
  </body>
</html>
`.trim()

export default defaultLayout
