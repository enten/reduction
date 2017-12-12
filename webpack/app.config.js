const plugins = require('./lib/plugins')
const rules = require('./lib/moduleRules')

const {
  dirname,
  join
} = require('path')

const {
  compact
} = require('./lib/util')

const {
  context,
  appEntry,
  appName,
  appOutputPath,
  appPublicPath,
  envName,
  isDev,
  isProd,
  // nodeModulesDir,
  nodeModulesDir,
  nodeModulesRegex,
  serverHost,
  serverPort,
  serverUrl,
  statsFilename
} = require('../universal.config')

const devtool = isProd ? 'source-map' : 'eval'
const filename = isProd ? '[name].[hash].js' : '[name].js'
const chunkFilename = isProd ? '[name].[chunkhash].js' : '[name].js'
const resolveExtensions = () => ['.js', '.css', '.scss']

module.exports = {
  name: appName,
  target: 'web',
  context,
  devtool,
  entry: compact(
    'babel-polyfill',
    isDev && [
      'react-hot-loader/patch'
    ],
    'fetch-everywhere',
    appEntry
  ),
  output: {
    filename,
    chunkFilename,
    path: appOutputPath,
    publicPath: appPublicPath
  },
  resolve: {
    extensions: resolveExtensions()
  },
  module: {
    rules: compact(
      rules.babel({
        exclude: {
          test: (value) => {
            return nodeModulesRegex.test(value)
              && !~value.indexOf('@material')
              && !~value.indexOf('colors.css')
          }
        }
      }),
      rules.extractCss({
        extract: true,
        production: isProd,
        sassLoaderOptions: {
          includePaths: [
            nodeModulesDir
          ]
        }
      }),
      rules.fonts()
    )
  },
  plugins: compact(
    plugins.clean(appOutputPath, {
      root: context,
      verbose: false
    }),
    isDev && [
      plugins.webpack.namedModules()
    ],
    isProd && [
      plugins.webpack.hashedModulesIds(),
      plugins.webpack.optimize.uglifyJs({
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          screw_ie8: true,
          comments: false
        },
        sourceMap: true
      }),
      plugins.statsWriter({
        fields: null,
        filename: statsFilename
      })
    ],
    plugins.webpack.optimize.commonsChunk({
      filename,
      minChunks: Infinity,
      names: ['bootstrap']
    }),
    plugins.webpack.define({
      '__BROWSER__': JSON.stringify(true),
      '__NODE__': JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify(envName),
      'process.env.HOST': JSON.stringify(serverHost),
      'process.env.PORT': JSON.stringify(serverPort),
      'process.env.URL': JSON.stringify(serverUrl)
      ,
    }),
    plugins.extractCssChunks()
  )
}
