const ReduxStore = require('./ReduxStore')

const {
  NOT_FOUND,
  connectRoutes
} = require('redux-first-router')

const setIntoFunctionsMap = require('./util/setIntoFunctionsMap')

class RudyStore extends ReduxStore {
  get history () {
    return this.getHistory()
  }

  get routes () {
    return this.getRoutes()
  }
  
  get routesMap () {
    return this.getRoutesMap()
  }
  
  get routesOptions () {
    return this.getRoutesOptions()
  }

  get thunk () {
    return this.getThunk()
  }

  _reloadRudy () {
    const {
      routesMap,
      routesOptions
    } = this
    
    if (routesMap) {
      this.rudy = this.connectRoutes(routesMap, routesOptions)
    }

    return this._reload()
  }

  doesRedirect (res) {
    const location = this.getLocation()

    if (location  && location.kind === 'redirect') {
      res && res.redirect(302, location.pathname)

      return location.pathname
    }
  }

  // addRoute (key, route) {

  // }

  getEnhancersMap () {
    return Object.assign(super.getEnhancersMap(), this.rudy && {
      location: this.rudy.enhancer // TODO location must be an option
    })
  }

  getHistory () {
    return this.rudy && this.rudy.history
  }

  getLocation () {
    const state = this.getState()

    if (state) {
      return state.location // TODO location must be an option
    }
  }

  getMiddlewaresMap () {
    return Object.assign(super.getMiddlewaresMap(), this.rudy && {
      location: this.rudy.middleware // TODO location must be an option
    })
  }

  getReducersMap () {
    return Object.assign(super.getReducersMap(), this.rudy && {
      location: this.rudy.reducer // TODO location must be an option
    })
  }

  getRoutes () {
    return {
      map: this.getRoutesMap(),
      options: this.getRoutesOptions()
    }
  }

  getRoutesMap () {
    return this.getOption(['routes', 'map'])
  }

  getRoutesOptions () {
    return Object.assign({},
      this.getOption(['routes', 'options']),
      {
        basename: this.basename,
        initialEntries: this.initialEntries
      }
    )
  }

  getThunk () {
    if (this.rudy) {
      const {thunk} = this.rudy

      if (thunk) {
        return thunk.bind(null, this)
      }
    }
  }

  isLocationNotFound () {
    const location = this.getLocation()

    return !!location && location.type === NOT_FOUND
  }

  // removeRoute (key) {

  // }

  setRoutes ({map, options}) {
    map && this.setOption(['routes', 'map'], map)
    options && this.setOption(['routes', 'options'], options)

    return this._reloadRudy()
  }

  // TODO
  // setRoutesEntry
  // unsetRoutesEntry
  // setRoutesOption
  // unsetRoutesOption

  setRoutesMap (routesMap, routesOptions) {
    return this.setRoutes({
      map: routesMap,
      options: routesOptions
    })
  }

  setRoutesOptions (routesOptions) {
    return this.setRoutes({
      options: routesOptions
    })
  }
}

RudyStore.defineOptions({
  basename: {
    fallback: () => '',
    set: (store, key, value) => {
      return store
        .setOption('basename', value)
        ._reloadRudy()
    }
  },
  initialEntries: {
    fallback: () => '/',
    set: (store, key, value) => {
      return store
        .setOption('initialEntries', value)
        ._reloadRudy()
    }
  },
  connectRoutes: () => connectRoutes
})

module.exports = RudyStore
