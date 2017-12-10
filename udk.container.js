module.exports = {
  context: __dirname,
  hmr: true,
  metadirs: [
    'webpack/lib'
  ],
  metafiles: [
    '.babelrc',
    'package.json',
    'src/server.js',
    'webpack/app.config.js',
    'webpack/demo.config.js',
    'webpack/server.config.js',
    'universal.config.js'
  ],
  webpackConfig: 'webpack.config.js',

  bootstrap (proc, configPath) {
    this.logger.info('[udk] > bootstrap container')
  },
  injectWebpackStats (webpackStats, req, res) {
    res.locals = res.locals || Object.create(null)
    res.locals.webpackStats = Object.assign({}, res.locals.webpackStats, webpackStats)
  },
  onCompilerWatchClose () {
    this.logger.info('[udk] >>> compiler watch close')
  },
  onCompilerDone (stats) {
    this.logger.info('[udk] >>> compiler done')
  },
  onCompilerFailed (err) {
    this.logger.error('[udk] >>> compiler failed')
  },
  onCompilerWatching (err, stats) {
    this.logger.info('[udk] >>> compiler watching...')
  },
  onDown (event, ...args) {
    this.logger.info('[udk] >> container down', {event, args})
  },
  onUncaughtException (err) {
    this.logger.error('[udk] uncaught exception', err)
  },
  onUnhandledRejection (reason, promise) {
    this.logger.error('[udk] unhandled rejection', {reason, promise})
  },
  onUp (proc) {
    this.logger.info('[udk] >> container up')
  },
  prepareCompiler (compiler) {
    this.logger.info('[udk] >>> prepare webpack compiler')

    compiler.compilers.forEach((c) => {
      c.plugin('invalid', (file) => {
        this.logger.info('[udk] >>> compiler invalid', c.name, file)
      })
    })
  },
  prepareWebpackConfig () {
    this.logger.info('[udk] >>> prepare webpack config')
  }
}