const Optionable = require('./Optionable')
const Tapable = require('tapable')

class Hookable extends Optionable {
  constructor (options) {
    super(options)
    Tapable.call(this)
  }

  applyPluginsPromise (...args) {
    return new Promise((resolve, reject) => {
      this.applyPluginsAsync(...args, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

Object.assign(Hookable.prototype, Tapable.prototype)

module.exports = Hookable
