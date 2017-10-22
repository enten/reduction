module.exports = {
  options: {
    context: __dirname,
    hmr: {
      hotMiddlewareClient: {
        overlay: true
      }
    },
    metafiles: [
      '.babelrc',
      'package.json',
      'server.js',
      'universal.config.js',
      'webapp/css',
      'webpack.utils.js'
    ],
    webpackConfig: 'webpack.config.js'
  }
}