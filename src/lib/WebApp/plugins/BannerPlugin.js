const Plugin = require('../Plugin')

class BannerPlugin extends Plugin {
  constructor (options) {
    if (typeof options === 'string') {
      options = {value: options}
    }

    super(options)
  }

  apply (webapp) {
    webapp.plugin('new-dehydration', (dehydration) => {
      dehydration.plugin('before-dehydrate', (done) => {
        const value = this.getGetValue()

        if (value) {
          dehydration.appendRaw(value)
        }

        done()
      })
    })
  }
}

BannerPlugin
  .defineOption('getValue', (plugin) => plugin.value)
  .defineOption('value')

module.exports = BannerPlugin
