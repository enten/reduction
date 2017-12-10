const Hookable = require('../Hookable')

class WebApp extends Hookable {
  constructor (options) {
    super(options)

    this.defaultName('webapp')
    this.defaultPublicPath('/')
  }

  client (win) {
    const rehydration = this.newRehydration({
      getWindow: () => win || window
    })

    return rehydration
  }

  createDehydration (options) {
    const {Dehydration} = this

    return new Dehydration(options)
  }

  createRehydration (options) {
    const {Rehydration} = this

    return new Rehydration(options)
  }

  middleware () {
    const router = this.newRouter()

    router.get('*', async (req, res, next) => {
      try {
        const dehydration = this.newDehydration({
          req,
          res,
          next
        })

        await this.handleRequest(dehydration)
      } catch (err) {
        next(err)
      }
    })

    return router
  }

  mount (router) {
    router.use(this.publicPath, this.middleware())

    return this
  }

  newDehydration (options) {
    const dehydration = this.createDehydration(options)

    this.applyPlugins('new-hydration', dehydration)
    this.applyPlugins('new-dehydration', dehydration)

    return dehydration
  }

  newRehydration (options) {
    const rehydration = this.createRehydration(options)

    this.applyPlugins('new-hydration', rehydration)
    this.applyPlugins('new-rehydration', rehydration)

    return rehydration
  }

  newRouter () {
    const router = this.createRouter()

    this.applyPlugins('new-router', router)

    return router
  }
}

function DefaultDehydration (options) {
  throw new Error('Dehydration() must be overridden')
}

function DefaultRehydration (options) {
  throw new Error('Rehydration() must be overridden')
}

function defaultCreateRouter () {
  throw new Error('createRouter() must be overridden')
}

function defaultHandleRequest (dehydration) {
  const {next} = dehydration

  dehydration.dehydrate()
    .then(() => next())
    .catch(next)
}

WebApp
  .defineOption('name')
  .defineOption('publicPath')
  .defineOption('Dehydration', () => DefaultDehydration)
  .defineOption('Rehydration', () => DefaultRehydration)
  .defineOption('createRouter', () => defaultCreateRouter)
  .defineOption('handleRequest', () => defaultHandleRequest)

if (__BROWSER__) {
  const Rehydration = require('../Rehydration')

  WebApp.defineOption('Rehydration', () => Rehydration)
}

if (__NODE__) {
  const Dehydration = require('../Dehydration')
  const express = require('express')

  WebApp
    .defineOption('Dehydration', () => Dehydration)
    .defineOption('createRouter', () => express)
}

module.exports = WebApp
