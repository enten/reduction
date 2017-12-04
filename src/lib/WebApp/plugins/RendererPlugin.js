const Plugin = require('../Plugin')

class RendererPlugin extends Plugin {
  apply (webapp) {
    webapp.plugin('new-dehydration', (dehydration) => {
      const {
        afterDehydrate,
        beforeDehydrate,
        dehydrate
      } = this

      afterDehydrate &&
        dehydration.plugin('after-dehydrate', afterDehydrate.bind(this, dehydration))

      beforeDehydrate &&
        dehydration.plugin('before-dehydrate', beforeDehydrate.bind(this, dehydration))

      dehydrate &&
        dehydration.plugin('dehydrate', dehydrate.bind(this, dehydration))
    })

    webapp.plugin('new-rehydration', (rehydration) => {
      const {
        afterRehydrate,
        beforeRehydrate,
        rehydrate
      } = this

      afterRehydrate &&
        rehydration.plugin('after-rehydrate', afterRehydrate.bind(this, rehydration))

      beforeRehydrate &&
        rehydration.plugin('before-rehydrate', beforeRehydrate.bind(this, rehydration))

      rehydrate &&
        rehydration.plugin('rehydrate', rehydrate.bind(this, rehydration))
    })
  }
}

// function defaultDehydrate (dehydration, done) {
//   throw new Error('dehydrate() must be overridden')
// }

function defaultGetStore (hydration) {
  if (hydration.getStore) {
    return hydration.getStore()
  }
}

// function defaultRehydrate (rehydration, done) {
//   throw new Error('rehydrate() must be overridden')
// }

RendererPlugin.defineOptions({
  afterDehydrate: () => {},
  afterRehydrate: () => {},
  beforeDehydrate: () => {},
  beforeRehydrate: () => {},
  dehydrate: () => {},//defaultDehydrate,
  getStore: () => defaultGetStore,
  rehydrate: () => {},//defaultRehydrate
})

module.exports = RendererPlugin
