const plugins = require('./lib/plugins')
const rules = require('./lib/moduleRules')

const {
  compact,
  getExternals
} = require('./lib/util')

const {
  appName,
  context,
  demoName,
  envName,
  isDev,
  isProd,
  nodeModulesDir,
  serverName,
  serverEntry,
  serverHost,
  serverOutputPath,
  serverPort,
  serverUrl
} = require('../universal.config')

const devtool = isProd ? 'source-map' : 'eval'
const resolveExtensions = () => ['.js', '.css', '.styl']

const server = {
  name: serverName,
  dependencies: [
    appName,
    demoName
  ],
  target: 'node',
  context,
  devtool,
  entry: compact(
    'source-map-support/register',
    'babel-polyfill',
    'fetch-everywhere',
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
      rules.babel({
        exclude: new RegExp(nodeModulesDir)
      }),
      rules.extractCss({
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
        case 'babel-polyfill':
        case 'fetch-everywhere':
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
    plugins.clean(serverOutputPath, {
      root: context,
      verbose: false
    }),
    isDev && [
      plugins.webpack.namedModules()
    ],
    isProd && [
      plugins.webpack.hashedModulesIds()
    ],
    plugins.webpack.optimize.limitChunkCount({
      maxChunks: 1
    }),
    plugins.webpack.define({
      '__BROWSER__': JSON.stringify(false),
      '__NODE__': JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify(envName),
      'process.env.HOST': JSON.stringify(serverHost),
      'process.env.PORT': JSON.stringify(serverPort),
      'process.env.URL': JSON.stringify(serverUrl)
    })
  )
}

module.exports = server
