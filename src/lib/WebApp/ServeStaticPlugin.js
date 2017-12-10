const Plugin = require('./Plugin')

class ServeStaticPlugin extends Plugin {
  constructor (options) {
    if (typeof options === 'string') {
      options = Object.assign({}, arguments[1], {
        root: options
      })
    }

    super(options)
  }

  onNewRouter (router) {
    const {
      options,
      root
    } = this

    const serveStatic = this.serveStatic(root, options)

    router.use(serveStatic)
  }
}

function defaultServeStatic () {
  throw new Error('serveStatic() must be overridden')
}

ServeStaticPlugin
  .defineOption('root')
  .defineOption('serveStatic', () => defaultServeStatic)

if (__NODE__) {
  const express = require('express')

  ServeStaticPlugin
    .defineOption('serveStatic', () => express.static)
}
module.exports = ServeStaticPlugin