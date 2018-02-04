const resultLayout = ({ testName }: { testName: string }) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Shutter test case results</title>
    <style>
      body {
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Test Case Results - ${testName}</h1>

    <h2>Actual image</h2>
    <a href="./actual.png">
      <img src="./actual.png" />
    </a>

    <h2>Expected image</h2>
    <a href="./expected.png">
      <img src="./expected.png" />
    </a>

    <h2>Visual diff</h2>
    <a href="./diff.png">
      <img src="./diff.png" />
    </a>
  </body>
</html>
`.trim()

export default resultLayout
