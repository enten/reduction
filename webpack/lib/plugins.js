const {plugin} = require('./util')

module.exports = {
  clean: plugin.bind(null, 'clean-webpack-plugin'),
  extractCssChunks: plugin.bind(null, 'extract-css-chunks-webpack-plugin'),
  statsWriter: plugin.bind(null, 'webpack-stats-plugin/lib/stats-writer-plugin'),
  webpack: {
    define: plugin.bind(null, 'webpack/lib/DefinePlugin'),
    hashedModulesIds: plugin.bind(null, 'webpack/lib/HashedModuleIdsPlugin'),
    namedModules: plugin.bind(null, 'webpack/lib/NamedModulesPlugin'),
    optimize: {
      commonsChunk: plugin.bind(null, 'webpack/lib/optimize/CommonsChunkPlugin'),
      limitChunkCount: plugin.bind(null, 'webpack/lib/optimize/LimitChunkCountPlugin'),
      uglifyJs: plugin.bind(null, 'webpack/lib/optimize/UglifyJsPlugin')
    }
  }
}
