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
      'src/css',
      'src/server.js',
      'webpack.utils.js',
      'universal.config.js'
    ],
    webpackConfig: 'webpack.config.js'
  }
}