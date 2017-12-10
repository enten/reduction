const ReactRendererPlugin = require('../lib/WebApp/ReactRendererPlugin')
const StorePlugin = require('../lib/WebApp/StorePlugin')
const WebApp = require('../lib/WebApp')
const RudyStore = require('../lib/RudyStore')

const uconfig = require('../../universal.config')

const {default: App} = require('./components/App')
const {default: configureStore} = require('./configureStore')

const webapp = new WebApp({
  name: uconfig.demoName,
  publicPath: uconfig.demoPublicPath
})

const renderer = new ReactRendererPlugin({
  Component: App
})

const storePlugin = new StorePlugin({
  createStore: (options) => new RudyStore(options),
  configureStore
})

webapp.apply(storePlugin)
webapp.apply(renderer)

webapp.plugin('new-dehydration', (dehydration) => {
  const {doc} = dehydration

  dehydration.plugin('after-dehydrate', (done) => {
    const scripts = doc.getElementsByTagName('script')

    scripts.forEach((scriptTag) => {
      scriptTag.setAttribute('nonce', 'fake')
    })

    done()
  })

  const metaTag = doc.createElement('meta')
  metaTag.setAttribute('charset', 'UTF-8')

  doc.head.appendChild(metaTag
)
  doc.title = 'foobar'
})

webapp.setHandleRequest(async (dehydration) => {
  const {res, next} = dehydration
  const store = dehydration.getStore()

  let status = 200

  if (store) {
    if (store.doesRedirect(res)) {
      return next()
    }

    try {
      const {thunk} = store

      if (thunk) {
        await thunk()
      }
    } catch (err) {
      next(err)
    }

    if (store.doesRedirect(res)) {
      return next()
    }

    if (store.isLocationNotFound()) {
      status = 404
    }
  }

  res.status(status)

  dehydration.dehydrate()
    .then(() => {
      res.send(dehydration.htmlToString())
      next()
    })
    .catch(next)
})

if (__NODE__) {
  const FlushChunksPlugin = require('../lib/WebApp/FlushChunksPlugin')
  const ServeStaticPlugin = require('../lib/WebApp/ServeStaticPlugin')
  const videos = require('./services/videos')

  const flushChunksPlugin = new FlushChunksPlugin({
    flushOptions: {
      outputPath: uconfig.demoOutputPath
    }
  })

  flushChunksPlugin.setGetStats(function ({res}) {
    if (this.stats) {
      return this.stats
    }

    if (res) {
      const {webpackStats} = res.locals

      if (webpackStats) {
        return webpackStats[this.webapp.name]
      }
    }
  })

  if (uconfig.isProd) {
    const {readFileSync} = require('fs')
    const {resolve} = require('path')

    const statsPath = resolve(uconfig.demoOutputPath, uconfig.statsFilename)
    const statsRaw = readFileSync(statsPath, 'utf8')
    const stats = JSON.parse(statsRaw)

    flushChunksPlugin.setStats(stats)
  }

  const serveStaticPlugin = new ServeStaticPlugin(uconfig.demoOutputPath)

  webapp.apply(flushChunksPlugin)
  webapp.apply(serveStaticPlugin)

  webapp.plugin('new-router', (router) => {
    router.use('/videos', videos.middleware())
  })
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderer.setComponent(require('./components/App').default)
  })
}

module.exports = webapp
