const ChunksPlugin = require('../lib/WebApp/plugins/ChunksPlugin')
const express = require('express')
const uconfig = require('../../universal.config')

module.exports = (webapp) => {
  const chunksPlugin = new ChunksPlugin({
    getStats ({res}) {
      const {webpackStats} = res.locals

      if (webpackStats) {
        return webpackStats[webapp.name]
      }
    }
  })

  if (uconfig.isProd) {
    const {readFileSync} = require('fs')
    const {resolve} = require('path')

    const statsPath = resolve(webapp.outputPath, uconfig.statsFilename)
    const statsRaw = readFileSync(statsPath, 'utf8')
    const stats = JSON.parse(statsRaw)

    chunksPlugin.setGetStats(() => stats)
  }

  webapp
    .setCreateRouter(express)
    .setServeStatic(express.static)
    .apply(chunksPlugin)
}