const {resolve} = require('path')

const envName = process.env.NODE_ENV || 'development'
const isProd = envName === 'production'
const isDev = !isProd

const R = resolve.bind(null, __dirname)
const dist = R.bind(null, 'dist')

const nodeModulesDir = 'node_modules'

module.exports = {
  context: R(),
  clientEntry: R('client.js'),
  clientOutputPath: dist('client'),
  clientPublicPath: '/clt/',
  envName,
  isDev,
  isProd,
  nodeModulesDir,
  outputEntryName: 'main',
  serverEntry: R('server.js'),
  serverHost: '0.0.0.0',
  serverOutputPath: dist('server'),
  serverPort: 3000,
  statsFilename: 'stats.json'
}
