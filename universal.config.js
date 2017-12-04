const {join} = require('path')

const envName = process.env.NODE_ENV || 'development'

const isProd = envName === 'production'
const isDev = !isProd

const R = join.bind(null, __dirname)
const dist = R.bind(null, 'dist')

const nodeModulesDir = 'node_modules'

module.exports = {
  context: R(),

  appName: 'app',
  appEntry: R('src', 'app', 'client.js'),
  appOutputPath: dist('app'),
  appPublicPath: '/app/',

  demoName: 'demo',
  demoEntry: R('src', 'demo', 'client.js'),
  demoOutputPath: dist('demo'),
  demoPublicPath: '/demo/',

  envName,

  isDev,
  isProd,

  nodeModulesDir,
  nodeModulesPath: R(nodeModulesDir),
  nodeModulesRegex: new RegExp(nodeModulesDir),

  outputEntryName: 'main',

  serverName: 'server',
  serverEntry: R('src', 'server.js'),
  serverHost: process.env.HOST || 'localhost',
  serverOutputPath: dist(),
  serverPort: process.env.PORT || 3000,
  get serverUrl () {
    return process.env.URL || `http://${this.serverHost}:${this.serverPort}`
  },

  statsFilename: 'stats.json'
}
