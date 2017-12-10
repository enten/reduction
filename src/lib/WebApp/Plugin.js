const Optionable = require('../Optionable')

class Plugin extends Optionable {
  apply (webapp) {
    this.webapp = webapp

    const {
      afterDehydrate,
      afterRehydrate,
      beforeDehydrate,
      beforeRehydrate,
      onDehydrate,
      onNewDehydration,
      onNewHydration,
      onNewRehydration,
      onNewRouter,
      onNewStore,
      onRehydrate
    } = this

    onNewHydration
      && webapp.plugin('new-hydration', onNewHydration.bind(this))

    onNewDehydration
      && webapp.plugin('new-dehydration', onNewDehydration.bind(this))

    if (beforeDehydrate || onDehydrate || afterDehydrate) {
      webapp.plugin('new-dehydration', (dehydration) => {
        beforeDehydrate
          && dehydration.plugin('before-dehydrate', beforeDehydrate.bind(this, dehydration))

        onDehydrate
          && dehydration.plugin('dehydrate', onDehydrate.bind(this, dehydration))

        afterDehydrate
          && dehydration.plugin('after-dehydrate', afterDehydrate.bind(this, dehydration))
      })
    }

    onNewRehydration
      && webapp.plugin('new-rehydration', onNewRehydration.bind(this))

    if (beforeRehydrate || onRehydrate || afterRehydrate) {
      webapp.plugin('new-rehydration', (rehydration) => {
        beforeRehydrate
          && rehydration.plugin('before-rehydrate', beforeRehydrate.bind(this, rehydration))

        onRehydrate
          && rehydration.plugin('rehydrate', onRehydrate.bind(this, rehydration))

        afterRehydrate
          && rehydration.plugin('after-rehydrate', afterRehydrate.bind(this, rehydration))
      })
    }

    onNewRouter
      && webapp.plugin('new-router', onNewRouter.bind(this))

    onNewStore
      && webapp.plugin('new-store', onNewStore.bind(this))
  }
}

module.exports = Plugin
