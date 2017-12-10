const Plugin = require('./Plugin')

class BannerPlugin extends Plugin {
  constructor (options) {
    if (typeof options === 'string') {
      options = {value: options}
    }

    super(options)
  }

  onNewDehydration (dehydration) {
    const {htmlToString} = dehydration

    dehydration.htmlToString = () => {
      const {
        position,
        value
      } = this

      const html = htmlToString.call(dehydration)

      if (position === 'bottom') {
        return [html, value].join('\n')
      }

      return [value, html].join('\n')
    }
  }
}

BannerPlugin
  .defineOption('getValue', (plugin) => plugin.value)
  .defineOption('position', () => 'top')
  .defineOption('value')

module.exports = BannerPlugin
