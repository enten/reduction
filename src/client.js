import configureStore from './configureStore'
import createHistory from 'history/createBrowserHistory'
import hydrateAppFromHtml from './lib/hydrateAppFromHtml'
import uconfig from '../universal.config'

import App from './components/App'

const {
  containerId,
  storeExportName
} = uconfig.webapp

const history = createHistory()
const storeState = window[storeExportName] || {}
const {store} = configureStore(history, storeState)

hydrateAppFromHtml(containerId, store, App)

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const HotApp = require('./components/App').default

    hydrateAppFromHtml(containerId, store, HotApp)
  })
}
