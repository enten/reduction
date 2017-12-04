const Redux = require('redux')
const StateManager = require('./StateManager')

const setIntoFunctionsMap = require('./util/setIntoFunctionsMap')
const unsetIntoFunctionsMap = require('./util/unsetIntoFunctionsMap')

class ReduxStore extends StateManager {
  get enhancers () {
    return this.getEnhancersMap()
  }

  get middlewares () {
    return this.getMiddlewaresMap()
  }

  get reducers () {
    return this.options.reducers
  }

  get redux () {
    if (!this._redux) {
      this._init()
    }

    return this._redux
  }

  _init (state) {
    if (!arguments.length) {
      state = this.initState
    }

    const enhancer = this.getEnhancer()
    const reducer = this.getReducer()

    this._redux = this.createStore(reducer, state, enhancer)

    const prevListeners = [].concat(this.listeners)
  
    prevListeners.forEach((listener) => {
      this.unsubscribe(listener)
      this.subscribe(listener)
    })

    return this
  }

  _reload (state) {
    if (this._redux) {
      this._init(state || this._redux.getState())
    }

    return this
  }

  _reloadReducer (reducer) {
    if (this._redux) {
      this._redux.replaceReducer(reducer || this.getReducer())
    }

    return this
  }

  dispatch (action) {
    return this.redux.dispatch(action)
  }

  getEnhancer () {
    const fns = this.getEnhancersSet()
    const middleware = this.getMiddleware()

    middleware && fns.unshift(middleware)

    if (fns.length) {
      return this.compose(...fns)
    }
  }

  getEnhancersMap () {
    return Object.assign({}, this.options.enhancers)
  }

  getEnhancersSet () {
    const enhancers = this.getEnhancersMap()

    return Object.keys(enhancers).map((key) => enhancers[key])
  }

  getMiddleware () {
    const fns = this.getMiddlewaresSet()

    if (fns.length) {
      return this.applyMiddleware(...fns)
    }
  }

  getMiddlewaresMap () {
    return Object.assign({}, this.options.middlewares)
  }

  getMiddlewaresSet () {
    const middlewares = this.getMiddlewaresMap()

    return Object.keys(middlewares).map((key) => middlewares[key])
  }

  getReducer () {
    const reducers = this.getReducersMap()

    return this.combineReducers(reducers)
  }

  getReducersMap () {
    return Object.assign({}, this.options.reducers)
  }

  getState () {
    return this.redux.getState()
  }

  // init (state) {
  //   this.listeners.forEach((listener) => {
  //     this.unsubscribe(listener)
  //   })

  //   return this._init(state)
  // }

  replaceReducer (nextReducer) {
    return this.redux.replaceReducer(nextReducer)
  }

  setEnhancer (name, fn) {
    setIntoFunctionsMap([this.options, 'enhancers'], name, fn)

    return this._reload()
  }

  setMiddleware (name, fn) {
    setIntoFunctionsMap([this.options, 'middlewares'], name, fn)

    return this._reload()
  }

  setReducer (name, fn) {
    setIntoFunctionsMap([this.options, 'reducers'], name, fn)

    return this._reloadReducer()
  }

  unsetEnhancer (name) {
    unsetIntoFunctionsMap([this.options, 'enhancers'], name)

    return this._reload()
  }

  unsetMiddleware (name) {
    unsetIntoFunctionsMap([this.options, 'middlewares'], name)

    return this._reload()
  }

  unsetReducer (name) {
    unsetIntoFunctionsMap([this.options, 'reducers'], name)

    return this._reloadReducer()
  }

  subscribe (listener) {
    let unsub

    if (this._redux) {
      unsub = this._redux.subscribe(listener)
    }

    return super.subscribe(listener, unsub)
  }
}

ReduxStore.defineOptions({
  applyMiddleware: () => Redux.applyMiddleware,
  combineReducers: () => Redux.combineReducers,
  compose: () => Redux.compose,
  createStore: () => Redux.createStore,
})

module.exports = ReduxStore
