const BannerPlugin = require('./BannerPlugin')

class DoctypePlugin extends BannerPlugin {

}

DoctypePlugin.defineOption('value', {
  fallback: () => 'html',
  getLense: (doctype) => `<!doctype ${doctype}>`
})

module.exports = DoctypePlugin
