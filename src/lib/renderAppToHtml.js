import React from 'react'
import ReactDOM from 'react-dom/server'
import {Provider} from 'react-redux'
import {flushChunkNames} from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'

export default function renderAppToHtml (stats, store, Component, options = {}) {
  const {
    afterJs = '',
    afterStyles = '',
    beforeJs = '',
    beforeStyles = '',
    charset = 'utf-8',
    containerId = 'root',
    doctype = '<!doctype html>',
    lang,
    storeExportName = '__REDUX_STORE',
    title = 'Untitled'
  } = options

  const chunkNames = flushChunkNames()
  const {
    cssHash,
    js,
    styles
  } = flushChunks(stats, {chunkNames})

  let body
  let storeState = JSON.stringify({})

  if (store) {
    body = ReactDOM.renderToString(
      <Provider store={store}>
        <Component />
      </Provider>
    )

    storeState = JSON.stringify(store.getState())
  } else {
    body = ReactDOM.renderToString(<Component />)
  }

  return doctype
    + `<html${lang ? ' lang="' + lang + '"' : ''}>`
      + `<head>`
        + `<meta charset="${charset}" />`
        + `<title>${title}</title>`
        + beforeStyles
        + styles
        + afterStyles
      + `</head>`
      + `<body>`
        + `<div id="${containerId}">`
          + body
        + `</div>`
        + `<script type="text/javascript">`
        + `window.${storeExportName}=${storeState}`
        + `</script>`
        + cssHash
        + beforeJs
        + js
        + afterJs
      + `</body>`
    + `</html>`
}
