import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from 'redux'

import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction'

export default function createRouterStore (rudy, options = {}) {
  let {
    actionCreators,
    enhancers = [],
    middlewares = [],
    reducers = {},
    routerReducerName = 'location',
    state = {}
  } = options

  if (typeof enhancers === 'function') {
    enhancers = [enhancers]
  }

  if (typeof middlewares === 'function') {
    middlewares = [middlewares]
  }

  if (typeof reducers === 'function') {
    reducers = [reducers]
  }

  const reducer = combineReducers({...reducers, [routerReducerName]: rudy.reducer})
  const middleware = applyMiddleware(rudy.middleware, ...middlewares)
  const enhancer = composeEnhancers({actionCreators}, rudy.enhancer, middleware, ...enhancers)

  return createStore(reducer, state, enhancer)
}

export function composeEnhancers (devToolsOptions, ...args){
  if (typeof window !== 'undefined') {
    return composeWithDevTools(devToolsOptions)(...args)
  }

  return compose(...args)
}
