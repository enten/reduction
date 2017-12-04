const Hookable = require('../Hookable')

const {
  Dehydration,
  Rehydration
} = require('./Hydration')

class WebApp extends Hookable {
  client (win) {
    const rehydration = this.newRehydration({win})

    return rehydration
  }

  middleware () {
    const router = this.newRouter()

    router.use((req, res, next) => {
      const dehydration = this.newDehydration({
        req,
        res,
        next
      })

      res.locals[dehydration.name] = dehydration

      this.handleRequest(dehydration)
    })

    if (this.publicPath !== '/') {
      return this.createRouter().on('mount', (parent) => {
        parent._router.stack.pop()
        parent._router.use(this.publicPath, router)
      })
    }

    return router
  }

  newDehydration (options) {
    const dehydration = this.createDehydration(this, options)

    this.applyPlugins('new-hydration', dehydration)
    this.applyPlugins('new-dehydration', dehydration)

    return dehydration
  }

  newRehydration (options) {
    const rehydration = this.createRehydration(this, options)

    this.applyPlugins('new-hydration', rehydration)
    this.applyPlugins('new-rehydration', rehydration)

    return rehydration
  }

  newRouter (options) {
    const router = this.createRouter(options)

    const {
      outputPath,
      serveStatic,
      serveStaticOptions
    } = this

    if (outputPath) {
      router.use(serveStatic(outputPath, serveStaticOptions))
    }

    this.applyPlugins('new-router', router)

    router.on('mount', () => console.log('mountpath', router.mountpath))

    return router
  }
}

function defaultCreateRouter (options) {
  throw new Error('createRouter() must be overridden')
}

function defaultCreateDehydration (webapp, options) {
  return new Dehydration(webapp, options)
}

function defaultCreateRehydration (webapp, options) {
  return new Rehydration(webapp, options)
}

function defaultHandleRequest (dehydration) {
  const {next} = dehydration

  return dehydration.dehydrate()
      .then(() => {
        next()
        return dehydration
      })
      .catch(next)
}

function defaultServeStatic (path, options) {
  throw new Error('serveStatic() must be overridden')
}

WebApp.defineOptions({
  name: () => 'webapp',
  outputPath: () => {},
  publicPath: () => '/',
  createDehydration: () => defaultCreateDehydration,
  createRehydration: () => defaultCreateRehydration,
  createRouter: () => defaultCreateRouter,
  handleRequest: () => defaultHandleRequest,
  serveStatic: () => defaultServeStatic,
  serveStaticOptions: () => {}
})

module.exports = WebApp
