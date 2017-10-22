const {readdirSync} = require('fs')
const {resolve} = require('path')

function babelRule (options = {}) {
  return Object.assign({
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  }, options)
}

function compact (...args) {
  return [].concat(...args).filter((value) => value)
}

function extractCssRule (options = {}) {
  if (typeof options === 'function') {
    options = {extract: options}
  }

  const {
    cssLoader = 'css-loader',
    cssLoaderOptions = {},
    exclude,
    extract,
    preCssLoader = 'stylus-loader',
    preCssLoaderOptions = {},
    test = /\.styl$/
  } = options

  const rule = {
    test,
    exclude,
    use: [
      {
        loader: cssLoader,
        options: Object.assign({
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]'
        }, cssLoaderOptions)
      },
      {
        loader: preCssLoader,
        options: Object.assign({}, preCssLoaderOptions)
      }
    ]
  }

  if (extract) {
    rule.use = extract(rule.use)
  }

  return rule
}

function getExternals (options = {}) {
  if (typeof options === 'string') {
    options = {context: options}
  }

  if (typeof options === 'function') {
    options = {filter: options}
  }

  if (typeof arguments[1] === 'function') {
    options = Object.assign({filter: arguments[1]}, options)
  }

  const context = options.context || process.cwd()
  const filter = options.filter || (() => true)
  const modulesDir = options.modulesDir || 'node_modules'
  const importType = options.importType || 'commonjs'

  return readdirSync(resolve(context, modulesDir))
    .filter(filter)
    .reduce((acc, mod) => {
      acc[mod] = [importType, mod].join(' ')

      return acc
    }, {})
}

Object.assign(exports, {
  babelRule,
  compact,
  extractCssRule,
  getExternals
})