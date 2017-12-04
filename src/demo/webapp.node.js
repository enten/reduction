const ChunksPlugin = require('../lib/WebApp/plugins/ChunksPlugin')
const cookieParser = require('cookie-parser')
const express = require('express')
const videos = require('./services/videos')
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

  webapp.plugin('new-router', (router) => {
    router.use(cookieParser())

    router.use((req, res, next) => {
      if (!req.cookies.jwt) {
        // TRY: set to 'real' to authenticate ADMIN route
        req.cookies.jwt = 'fake'
      }

      next()
    })

    router.use((req, res, next) => {
      const jwtCookie = req.cookies.jwt
      const jwtHeader =(req.headers.authorization || '').split(' ')[1]
      const jwt = jwtHeader || jwtCookie
      const jwtSource = jwtHeader ? 'header' : jwtCookie ? 'cookie' : undefined

      Object.assign(req, {
        jwt,
        jwtCookie,
        jwtHeader,
        jwtSource
      })

      next()
    })

    router.use('/videos', videos.middleware())
  })
}
