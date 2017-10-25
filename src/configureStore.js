import {combineReducers} from 'redux'
import {connectRoutes} from 'redux-first-router'
import createRouterStore from './lib/createRouterStore'

import options from './options'
import routesMap from './routesMap'

import * as actionCreators from './actions'
import * as reducers from './reducers'

export default function configureStore (history, state) {
  const rudy = connectRoutes(history, routesMap, options)

  const store = createRouterStore(rudy, {
    actionCreators,
    reducers,
    state
  })

  if (module.hot) {
    module.hot.accept('./routesMap', () => {
      const reducers = require('./reducers/index')
      const routesMap = require('./routesMap').default
      const {reducer: location} = connectRoutes(history, routesMap)
      const rootReducer = combineReducers({...reducers, location})

      store.replaceReducer(rootReducer)
    })

    module.hot.accept('./reducers/index', () => {
      const reducers = require('./reducers/index')
      const rootReducer = combineReducers({...reducers, location: rudy.reducer})

      store.replaceReducer(rootReducer)
    })
  }

  return {
    store,
    thunk: rudy.thunk
  }
}
