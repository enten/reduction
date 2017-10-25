import {NOT_FOUND} from 'redux-first-router'
import configureStore from './configureStore'
import cookieParser from 'cookie-parser'
import createHistory from 'history/createMemoryHistory'
import noFavicons from 'express-no-favicons'
import express from 'express'
import renderAppToHtml from './lib/renderAppToHtml'
import uconfig from '../universal.config'
import serviceVideos from './services/videos'

import App from './components/App'

const api = express()

api.use(noFavicons())

if (uconfig.isProd) {
  require('udk/node/serveAssets')(api, {
    outputPath: uconfig.clientOutputPath,
    publicPath: uconfig.clientPublicPath,
    serveStatic: express.static,
    statsFilename: uconfig.statsFilename
  })
}

api.use(cookieParser())

api.use((req, res, next) => {
  if (!req.cookies.jwt) {
    // TRY: set to 'real' to authenticate ADMIN route
    req.cookies.jwt = 'fake'
  }

  next()
})

api.use((req, res, next) => {
  const jwtCookie = req.cookies.jwt
  const jwtHeader =(req.headers.authorization || '').split(' ')[1]
  const jwt = jwtHeader || jwtCookie
  const jwtSource = jwtHeader ? 'header' : jwtCookie ? 'cookie' : undefined

  Object.assign(req, {
    jwt,
    jwtCookie,
    jwtHeader,
    jwtSource
  })

  next()
})

api.use('/api', 
  express.Router()
    .use('/videos', serviceVideos())
)

api.use(async (req, res) => {
  const history = createHistory({initialEntries: [req.path]})
  const {store, thunk} = configureStore(history, {jwToken: req.jwt})

  const doesRedirect = ({kind, pathname}) => {
    if (kind === 'redirect') {
      res.redirect(302, pathname)
      return true
    }

    return false
  }

  let {location} = store.getState()

  if (doesRedirect(location)) {
    return
  }

  await thunk(store)

  location = store.getState().location

  if (doesRedirect(location)) {
    return
  }

  const status = location.type === NOT_FOUND ? 404 : 200
  const stats = res.locals.webpackClientStats
  const app = renderAppToHtml(stats, store, App, uconfig.webapp)

  res.status(status)
  res.send(app)
})

export default api