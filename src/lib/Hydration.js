const Hydratable = require('./Hydratable')

class Hydration extends Hydratable {
  dehydrate () {
    return this.applyPluginsPromise('before-dehydrate')
      .then(() => this.applyPluginsPromise('dehydrate'))
      .then(() => this.applyPluginsPromise('after-dehydrate'))
      .then(() => this)
  }

  rehydrate () {
    return this.applyPluginsPromise('before-rehydrate')
      .then(() => this.applyPluginsPromise('rehydrate'))
      .then(() => this.applyPluginsPromise('after-rehydrate'))
      .then(() => this)
  }
}

Hydration
  .defineOption('store')

module.exports = Hydration
