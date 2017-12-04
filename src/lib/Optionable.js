const Accessor = require('./Accessor')

class Optionable {
  static defineAccessor (name, options) {
    Accessor.for(this.prototype, name, options)

    return this
  }

  static defineOption (name, options) {
    Accessor
      .for(this.prototype, {parents: 'options'})
      .define(name, options)

    return this
  }

  static defineOptions (optionsMap) {
    Object.keys(optionsMap).forEach((name) => {
      this.defineOption(name, optionsMap[name])
    })

    return this
  }

  constructor (options = {}) {
    this.options = options
  }
  
  defaultOption (name, value) {
    Accessor.defaultIn(this.options, name, value)

    return this
  }

  defineOption (name, options) {
    Accessor
      .for(this, {parents: 'options'})
      .define(name, options)

    return this
  }

  defineOptions (optionsMap) {
    Object.keys(optionsMap).forEach((name) => {
      this.defineOption(name, optionsMap[name])
    })

    return this
  }

  getOption (name, fallback) {
    return Accessor.getIn(this.options, name, fallback)
  }

  hasOption (name) {
    return Accessor.hasIn(this.options, name)
  }

  setOption (name, value) {
    Accessor.setIn(this.options, name, value)

    return this
  }

  setOptions (options) {
    Object.keys(options).forEach((name) => {
      this.setOption(name, options[name])
    })

    return this
  }

  unsetOption (name) {
    Accessor.unset(this.options, name)

    return this
  }
}

module.exports = Optionable
