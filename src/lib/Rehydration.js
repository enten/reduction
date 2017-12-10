const Hydration = require('./Hydration')

class Rehydration extends Hydration {
  constructor (options) {
    super(options)

    this.win = this.getWindow()
  }

  get doc () {
    return this.win.document
  }
}

function defaultGetWindow () {
  return window
}

Rehydration
  .defineOption('getWindow', () => defaultGetWindow)

module.exports = Rehydration
