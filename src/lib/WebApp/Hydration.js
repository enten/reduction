const Hookable = require('../Hookable')

const WINDOW = typeof window !== 'undefined' ? window : undefined

class Hydration extends Hookable {
  constructor (webapp, options) {
    super(options)
    this.webapp = webapp
  }

  get name () {
    return this.webapp.name
  }
}

Hydration
  .defineOption('store')

class Dehydration extends Hydration {
  constructor (webapp, options) {
    super(webapp, options)

    this.defaultHead('')
    this.defaultBody('')
    this.defaultRaw('')
  }

  get request () {
    return this.req
  }

  get response () {
    return this.res
  }

  append (name, value, options) {
    if (name && typeof name === 'object') {
      Object.keys(name).forEach((key) => {
        this.append(key, name[key], value || options)
      })
    }

    if (name === 'body') {
      return this.appendBody(value, options)
    }

    if (name === 'head') {
      return this.appendHead(value, options)
    }

    if (name === 'raw') {
      return this.appendRaw(value, options)
    }

    throw new Error('appender unknown: ' + name)
  }

  appendBody (value, options) {
    this.body += value

    return this
  }

  appendHead (value, options) {
    this.head += value

    return this
  }

  appendRaw (value, options) {
    this.raw += value

    return this
  }

  dehydrate () {
    return this.applyPluginsPromise('before-dehydrate')
      .then(() => this.applyPluginsPromise('dehydrate'))
      .then(() => this.applyPluginsPromise('after-dehydrate'))
      .then(() => this)
  }

  toString () {
    const {
      body,
      head,
      raw
    } = this

    return raw + head + body
  }
}

Dehydration
  .defineOption('body')
  .defineOption('head')
  .defineOption('req')
  .defineOption('res')
  .defineOption('next')
  .defineOption('raw')

class Rehydration extends Hydration {
  constructor (webapp, options) {
    super(webapp, options)

    this.defaultWin(WINDOW)
  }

  rehydrate () {
    return this.applyPluginsPromise('before-rehydrate')
      .then(() => this.applyPluginsPromise('rehydrate'))
      .then(() => this.applyPluginsPromise('after-rehydrate'))
      .then(() => this)
    }
}

Rehydration
  .defineOption('win')

module.exports = {
  Dehydration,
  Hydration,
  Rehydration
}
