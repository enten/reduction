const {flushChunkNames} = require('react-universal-component/server')
const {default: flushChunks} = require('webpack-flush-chunks')
const Plugin = require('./Plugin')

class FlushChunksPlugin extends Plugin {
  onDehydrate (dehydration, done) {
    console.log('>', this.constructor.name, ': dehydrate')

    const stats = this.getStats(dehydration)

    if (stats) {
      const chunks = this.flushChunks(stats, this.flushOptions)

      this.appendChunks(dehydration, chunks)
    }

    done()
  }
}

function defaultAppendChunks (dehydration, chunks) {
  const {doc} = dehydration
  const {publicPath} = chunks

  chunks.stylesheets.forEach((stylesheet) => {
    const stylesheetHref = [chunks.publicPath, stylesheet].join('/')
    const stylesheetTag = doc.createElement('link')
    stylesheetTag.setAttribute('rel', 'stylesheet')
    stylesheetTag.setAttribute('href', stylesheetHref)

    doc.head.appendChild(stylesheetTag)
  })

  if (Object.keys(chunks.cssHashRaw).length) {
    const cssHashRawJson = JSON.stringify(chunks.cssHashRaw)
    const scriptTag = doc.createElement('script')
    scriptTag.innerHTML = `window['__CSS_CHUNKS__']=${cssHashRawJson}`

    doc.body.appendChild(scriptTag)
  }

  chunks.scripts.forEach((script) => {
    const scriptSrc = [chunks.publicPath, script].join('/')
    const scriptTag = doc.createElement('script')
    scriptTag.setAttribute('src', scriptSrc)

    doc.body.appendChild(scriptTag)
  })
}

function defaultFlushChunks (stats, options = {}) {
  if (!options.chunkNames) {
    options = Object.assign({}, options, {
      chunkNames: flushChunkNames()
    })
  }

  return flushChunks(stats, options)
}

function defaultGetStats (hydration) {
  return this.stats
}

FlushChunksPlugin
  .defineOption('flushOptions', () => ({}))
  .defineOption('stats')
  .defineOption('appendChunks', () => defaultAppendChunks)
  .defineOption('flushChunks', () => defaultFlushChunks)
  .defineOption('getStats', () => defaultGetStats)

module.exports = FlushChunksPlugin
