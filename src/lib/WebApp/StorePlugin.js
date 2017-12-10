const Plugin = require('./Plugin')

class StorePlugin extends Plugin {
  onDehydrate (dehydration, done) {
    console.log('>', this.constructor.name, ': dehydrate')
    const store = dehydration.getStore()

    if (store) {
      const {doc} = dehydration

      const scriptTag = doc.createElement('script')
      scriptTag.innerHTML = store.toJS()

      doc.head.appendChild(scriptTag)
    }

    done()
  }

  onNewDehydration (dehydration) {
    console.log('>', this.constructor.name, ': new dehydration')
    const store = dehydration.getStore()

    if (store) {
      store.setInitialEntries(dehydration.req.url)
    }
  }

  onNewHydration (hydration) {
    console.log('>', this.constructor.name, ': new hydration')
    if (!hydration.hasStore()) {
      const store = this.newStore({
        basename: this.webapp.publicPath
      }, hydration)

      hydration.setStore(store)
    }
  }

  onNewRehydration (rehydration) {
    console.log('>', this.constructor.name, ': new rehydration')
    const store = rehydration.getStore()

    if (store) {
      const initState = rehydration.win[store.exportKey]

      store.setInitState(initState)
    }
  }

  newStore (storeOptions, hydration) {
    const store = this.createStore(storeOptions)

    this.configureStore(store)

    hydration && hydration.applyPlugins('new-store', store)

    return store
  }
}

function defaultConfigureStore (store, hydration) {

}

function defaultCreateStore () {
  throw new Error('createStore() must be overridden')
}

StorePlugin.defineOptions({
  configureStore: () => defaultConfigureStore,
  createStore: () => defaultCreateStore
})

module.exports = StorePlugin
