const {resolve} = require('path')

const envName = process.env.NODE_ENV || 'development'
const isProd = envName === 'production'
const isDev = !isProd

const R = resolve.bind(null, __dirname)
const dist = R.bind(null, 'dist')

const nodeModulesDir = 'node_modules'

module.exports = {
  context: R(),
  clientEntry: R('src', 'client.js'),
  clientOutputPath: dist('webapp'),
  clientPublicPath: '/webapp/',
  envName,
  isDev,
  isProd,
  nodeModulesDir,
  outputEntryName: 'main',
  serverEntry: R('src', 'server.js'),
  serverHost: '0.0.0.0',
  serverOutputPath: dist(),
  serverPort: 3000,
  statsFilename: 'stats.json',
  webapp: {
    containerId: 'webapp',
    lang: 'en',
    storeExportName: '__WEBAPP_STATE',
    title: 'Reduction Starter Kit'
  }
}
