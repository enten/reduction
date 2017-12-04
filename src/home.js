const marked = require('marked')
const {readFileSync} = require('fs')
const {resolve} = require('path')

const readmePath = resolve(__dirname, '../README.md')
const readmeMd = readFileSync(readmePath, 'utf8')
const readmeHtml = marked(readmeMd.replace(/\.\//g, 'https://github.com/enten/reduction/tree/master/'))

module.exports = (req, res, next) => {
  res.send(`
  <!doctype html>
  <html>
    <head>
      <title>reduction</title>
    </head>
    <body>
      <div>
        <h1>localhost</h1>
        <ul>
          <li><a href="/app">/app</a></li>
          <li><a href="/demo">/demo</a></li>
        </ul>
        <hr />
        ${readmeHtml}
      </div>
    </body>
  </html>
  `)
}