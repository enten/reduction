import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction'

import * as reducers from './reducers'
import routesMap from './routesMap'
import routesOptions from './routesOptions'

let hotReducers = reducers
let hotRoutesMap = routesMap
let hotRoutesOptions = routesOptions

export default function configureStore (store) {
  store
    .setReducer(hotReducers)
    .setRoutesMap(hotRoutesMap)
    .setRoutesOptions(hotRoutesOptions)

  if (__BROWSER__) {
    const devTools = store.getOption('devTools', () => ({}))

    store.setCompose(composeWithDevTools(devTools))
  }

  if (module.hot && typeof window !== 'undefined') {
    module.hot.accept('./reducers/index', () => {
      store.setReducer(require('./reducers/index'))
    })

    module.hot.accept('./routesMap', () => {
      store.setRoutesMap(require('./routesMap').default)
    })

    module.hot.accept('./routesOptions', () => {
      store.setRoutesOptions(require('./routesOptions').default)
    })
  }
}

if (module.hot) {
  module.hot.accept('./reducers/index', () => {
    hotReducers = require('./reducers/index')
  })

  module.hot.accept('./routesMap', () => {
    hotRoutesMap = require('./routesMap').default
  })

  module.hot.accept('./routesOptions', () => {
    hotRoutesOptions = require('./routesOptions').default
  })
}
