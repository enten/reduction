import express from 'express'
import noFavicons from 'express-no-favicons'
import renderWebapp from './middlewares/renderWebapp'

import {
  clientOutputPath,
  clientPublicPath,
  isProd,
  statsFilename
} from './universal.config'

import WebApp from './webapp'

const requestHandler = module.exports = express()

if (isProd) {
  require('udk/node/serveAssets')(requestHandler, {
    outputPath: clientOutputPath,
    publicPath: clientPublicPath,
    serveStatic: express.static,
    statsFilename
  })
}

requestHandler.use(noFavicons())
requestHandler.use(renderWebapp(WebApp))

