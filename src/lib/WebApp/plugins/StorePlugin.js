const Plugin = require('../Plugin')

class StorePlugin extends Plugin {
  apply (webapp) {
    webapp.plugin('new-hydration', (hydration) => {
      if (!hydration.hasStore()) {
        const store = this.newStore({
          basename: webapp.publicPath
        }, hydration)

        hydration.setStore(store)
      }
    })

    webapp.plugin('new-dehydration', (dehydration) => {
      const store = dehydration.getStore()

      if (store) {
        store.setInitialEntries(dehydration.req.url)
      }

      dehydration.plugin('dehydrate', (done) => {
        const store = dehydration.getStore()

        if (store) {
          dehydration.appendHead(store.toHTML())
        }

        done()
      })
    })

    webapp.plugin('new-rehydration', (rehydration) => {
      const store = rehydration.getStore()

      if (store) {
        const initState = rehydration.win[store.exportKey]

        store.setInitState(initState)
      }
    })
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
