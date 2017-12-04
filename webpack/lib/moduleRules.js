function babel (options = {}) {
  return Object.assign({
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  }, options)
}

function extractCss (options = {}) {
  if (typeof options === 'function') {
    options = {extract: options}
  }

  if (typeof options === 'boolean') {
    options = {extract: options}
  }

  if (options && options.extract && typeof options.extract !== 'function') {
    options.extract = require('extract-css-chunks-webpack-plugin').extract
  }

  const {
    cssLoader = 'css-loader',
    cssLoaderOptions = {},
    exclude,
    extract,
    preCssLoader = 'stylus-loader',
    preCssLoaderOptions = {},
    test = /\.(css|styl)$/
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

module.exports = {
  babel,
  extractCss
}
