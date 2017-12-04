const ReactRendererPlugin = require('../lib/WebApp/plugins/ReactRendererPlugin')
const RendererPlugin = require('../lib/WebApp/plugins/RendererPlugin')
const RudyStore = require('../lib/RudyStore')
const StorePlugin = require('../lib/WebApp/plugins/StorePlugin')
const WebApp = require('../lib/WebApp')

import App from './components/App'
import configureStore from './configureStore'
import uconfig from '../../universal.config'

const renderer = new ReactRendererPlugin({
  Component: App
})

const storePlugin = new StorePlugin({
  createStore: (options, hydration) => new RudyStore(options),
  configureStore
})

const templatePlugin = new RendererPlugin({
  afterDehydrate (dehydration, done) {
    const {
      body,
      head
    } = dehydration

    let title = ''

    const store = dehydration.getStore()

    if (store) {
      title = store.getState().title
    }

    dehydration.body = ''
    dehydration.head = ''

    dehydration.appendRaw(
      '<!doctype html>' +
      '<html>' +
        '<head>' +
          head +
          '<title>' + title + '</title>' +
        '</head>' +
        '<body>' + body + '</body>' +
      '</html>'
    )

    done()
  }
})

const webapp = new WebApp({
  name: uconfig.appName,
  outputPath: uconfig.appOutputPath,
  publicPath: uconfig.appPublicPath
})

webapp.setHandleRequest(async (dehydration) => {
  const {res, next} = dehydration
  const store = dehydration.getStore()

  // let status = 200

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
      // status = 404
      return next()
    }
  }

  // res.status(status)

  dehydration.dehydrate()
    .then(() => {
      console.log('> dehydration', dehydration.name)
      res.send(dehydration.toString())
      next()
    })
    .catch(next)
})

webapp.apply(
  storePlugin,
  renderer,
  templatePlugin
)

if (__NODE__) {
  require('./webapp.node')(webapp)
}

if (module.hot) {
  module.hot.accept('./components/App', () => {
    renderer.setComponent(require('./components/App').default)
  })
}

module.exports = webapp
