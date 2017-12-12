function babel (options = {}) {
  return Object.assign({
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'babel-loader'
  }, options)
}

function fonts (options = {}) {
  return Object.assign({
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=[name].[ext]'
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
    include,
    // postCssLoader = 'postcss-loader',
    // postCssLoaderOptions = {},
    sassLoader = 'sass-loader',
    sassLoaderOptions = {},
    styleLoader = 'style-loader',
    styleLoaderOptions = {},
    test = /\.s?css$/
  } = options

  const rule = {
    test,
    exclude,
    include,
    use: []
  }

  cssLoader && rule.use.push({
    loader: cssLoader,
    options: Object.assign({
      modules: true,
      localIdentName: '[local]'
      // localIdentName: '[name]__[local]--[hash:base64:5]'
    }, cssLoaderOptions)
  })

  sassLoader && rule.use.push({
    loader: sassLoader,
    options: Object.assign({
      sourceMap: true,
      outputStyle: options.isProd || options.production ? 'compressed' : 'expanded'
    }, sassLoaderOptions)
  })

  if (extract) {
    rule.use = extract(rule.use)
  }

  return rule
}

function url (options) {
  return Object.assign({
    test: /\.(woff2?|ttf|eot|svg)$/,
    loader: 'url-loader?limit=10000',
    exclude: /node_modules|SVGIcon\/icons/,
  }, options)
}

module.exports = {
  babel,
  extractCss,
  fonts,
  url
}
