const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const {StatsWriterPlugin} = require('webpack-stats-plugin')
const webpack = require('webpack')

const {
  babelRule,
  compact,
  extractCssRule,
  getExternals
} = require('./webpack.utils')

const {
  context,
  clientEntry,
  clientOutputPath,
  clientPublicPath,
  envName,
  isDev,
  isProd,
  nodeModulesDir,
  outputEntryName,
  serverEntry,
  serverOutputPath,
  statsFilename
} = require('./universal.config')

const devtool = isProd ? 'source-map' : 'eval'
const filename = isProd ? '[name].[chunkhash].js' : '[name].js'
const resolveExtensions = () => ['.js', '.css', '.styl']

const client = {
  name: 'client',
  // target: 'web',
  context,
  devtool,
  entry: compact(
    isDev && [
      'react-hot-loader/patch'
    ],
    clientEntry
  ),
  output: {
    filename,
    chunkFilename: filename,
    path: clientOutputPath,
    publicPath: clientPublicPath
  },
  resolve: {
    extensions: resolveExtensions()
  },
  module: {
    rules: compact(
      babelRule({
        exclude: new RegExp(nodeModulesDir)
      }),
      extractCssRule(ExtractCssChunks.extract)
    )
  },
  plugins: compact(
    new CleanWebpackPlugin(clientOutputPath),
    isDev && [
      new webpack.NamedModulesPlugin()
    ],
    isProd && [
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {screw_ie8: true, warnings: false},
        mangle: {screw_ie8: true},
        output: {screw_ie8: true, comments: false},
        sourceMap: true
      }),
      new StatsWriterPlugin({
        fields: null,
        filename: statsFilename
      })
    ],
    new webpack.optimize.CommonsChunkPlugin({
      filename,
      minChunks: Infinity,
      names: ['bootstrap']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(envName)
    }),
    new ExtractCssChunks()
  )
}

const server = {
  name: 'server',
  dependencies: [client.name],
  target: 'node',
  context,
  devtool,
  entry: compact(
    'source-map-support/register',
    serverEntry
  ),
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: serverOutputPath
  },
  resolve: {
    extensions: resolveExtensions()
  },
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    rules: compact(
      babelRule({
        exclude: new RegExp(nodeModulesDir)
      }),
      extractCssRule({
        cssLoader: 'css-loader/locals',
        exclude: new RegExp(nodeModulesDir),
      })
    )
  },
  externals: getExternals({
    context,
    modulesDir: nodeModulesDir,
    filter: (mod) => {
      switch (mod) {
        case '.bin':
        case 'react-universal-component':
        case 'source-map':
        case 'source-map-support':
        case 'webpack-flush-chunks':
          return false
      }

      return true
    }
  }),
  plugins: compact(
    new CleanWebpackPlugin(serverOutputPath),
    isDev && [
      new webpack.NamedModulesPlugin(),
    ],
    isProd && [
      new webpack.HashedModuleIdsPlugin()
    ],
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(envName)
    })
  )
}

module.exports = [
  client,
  server
]