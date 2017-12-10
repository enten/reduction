const Optionable = require('./Optionable')

/**
 * TODO
 * * add action to dispatch when dehydrate
 * * add action to dispatch when rehydrate
 */

class StateManager extends Optionable {
  constructor (options) {
    super(options)

    this.listeners = []
    this.listenerUnsubscribers = []

    this.dispatch = this.dispatch.bind(this),
    this.getState = this.getState.bind(this),
    this.replaceReducer = this.dispatch.bind(this),
    this.subscribe = this.subscribe.bind(this)
  }
  
  dispatch (action) {
    throw new Error('dispatch() must be overridden')
  }
  
  getState () {
    throw new Error('getState() must be overridden')
  }

  getStateScript (options = {}) {
    const {
      exportKey = this.exportKey,
      exportVar = this.exportVar
    } = options

    const state = this.getStateString(options)

    return `${exportVar}['${exportKey}']=${state}`
  }
  
  getStateScriptTag (options = {}) {
    const {
      type = 'script'
    } = options

    const script = this.getStateScript(options)

    return `<${type}>${script}</${type}>`
  }

  getStateString (options = {}) {
    const {
      replacer,
      space
    } = options

    const state = this.getState()

    return JSON.stringify(state, replacer, space)
  }

  replaceReducer (nextReducer) {
    throw new Error('replaceReducer() must be overridden')
  }

  subscribe (listener, unsub) {
    const index = this.listeners.length

    this.listeners[index] = listener
    this.listenerUnsubscribers[index] = unsub

    return this.unsubscribe.bind(this, listener)
  }

  toHTML (options) {
    return this.getStateScriptTag(options)
  }
  
  toJS (options) {
    return this.getStateScript(options)
  }

  toJSON () {
    return this.getState()
  }

  toString (replacer, space) {
    return this.getStateString({replacer, space})
  }

  unsubscribe (listener) {
    const index = this.listeners.indexOf(listener)

    if (~index) {
      const unsub = this.listenerUnsubscribers[index]

      unsub && unsub()

      this.listeners.splice(index, 1)
      this.listenerUnsubscribers.splice(index, 1)
    }
  }
}

StateManager.defineOptions({
  exportKey: () => '__STATE__',
  exportVar: () => 'window',
  initState: () => {}
})

module.exports = StateManager
