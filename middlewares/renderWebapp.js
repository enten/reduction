import React from 'react'
import ReactDOM from 'react-dom/server'
import createHistory from 'history/createMemoryHistory'
import flushChunks from 'webpack-flush-chunks'
import {flushChunkNames} from 'react-universal-component/server'

export default function renderWebappMiddleware (WebApp) {
  return (req, res) => {
    const history = createHistory({initialEntries: [req.path]})
    const {webpackClientStats} = res.locals
    const appRendered = ReactDOM.renderToString(<WebApp history={history} />)
    const chunkNames = flushChunkNames()

    const {
      js,
      styles,
      cssHash,
      scripts,
      stylesheets
    } = flushChunks(webpackClientStats, {chunkNames})

    console.log('PATH', req.path)
    console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames)
    console.log('SCRIPTS SERVED', scripts)
    // console.log('STYLESHEETS SERVED', stylesheets)

    res.send(`
    <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reduction Boilerplate</title>
          ${styles}
        </head>
        <body>
          <div id="webapp">${appRendered}</div>
          ${cssHash}
          ${js}
        </body>
      </html>
    `)
  }
}