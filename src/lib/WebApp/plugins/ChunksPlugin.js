const {flushChunkNames} = require('react-universal-component/server')
const {default: flushChunks} = require('webpack-flush-chunks')
const Plugin = require('../Plugin')

class ChunksPlugin extends Plugin {
  apply (webapp) {
    webapp.plugin('new-dehydration', (dehydration) => {
      dehydration.plugin('dehydrate', (done) => {
        const stats = this.getStats(dehydration)
        
        if (stats) {
          const chunks = this.flushChunks(stats, {
            outputPath: webapp.outputPath
          })
          
          this.appendChunks(dehydration, chunks)
        }

        done()
      })
    })
  }
}

function defaultAppendChunks (dehydration, chunks) {
  const cssHash = chunks.cssHash.toString()
  const js = chunks.js.toString()
  const styles = chunks.styles.toString()

  styles.length && dehydration.appendHead(styles)
  cssHash.length && dehydration.appendBody(cssHash)
  js.length && dehydration.appendBody(js)
}

function defaultFlushChunks (stats, options = {}) {
  if (!options.chunkNames) {
    options = Object.assign({}, options, {
      chunkNames: flushChunkNames()
    })
  }

  return flushChunks(stats, options)
}

function defaultGetStats (dehydration) {
  throw new Error('getStats() must be overridden')
}

ChunksPlugin.defineOptions({
  appendChunks: () => defaultAppendChunks,
  flushChunks: () => defaultFlushChunks,
  getStats: () => defaultGetStats
})

module.exports = ChunksPlugin
