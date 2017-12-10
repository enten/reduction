const Accessor = require('../Accessor')
const Plugin = require('./Plugin')
const React = require('react')

class ReactRendererPlugin extends Plugin {
  constructor (options) {
    super(options)

    this.clients = []
  }

  onDehydrate (dehydration, done) {
    console.log('>', this.constructor.name, ': dehydrate')

    const {Component} = this
    const {doc} = dehydration

    const componentProps = Object.assign({}, dehydration.options)
    const component = React.createElement(Component, componentProps)
    const componentHtml = this.renderToString(component)

    const containerId = this.getContainerId()
    const containerTag = this.getContainerTag()

    const container = doc.createElement(containerTag)
    container.id = containerId
    container.innerHTML = componentHtml

    doc.body.appendChild(container)

    done()
  }

  onNewRehydration (rehydration) {
    this.clients.push(rehydration)
  }

  onRehydrate (rehydration, done) {
    console.log('>', this.constructor.name, ': rehydrate')

    const {Component} = this
    const {doc} = rehydration

    const componentProps = Object.assign({}, rehydration.options)
    const component = React.createElement(Component, componentProps)

    const containerId = this.getContainerId()
    const container = doc.getElementById(containerId)

    this.hydrateToElement(component, container, done)
  }

  updateClients () {
    console.log('>', this.constructor, ': update client!!!')

    return Promise.all(
      this.clients.map((rehydration) => rehydration.rehydrate())
    )
  }
}

function DefaultComponent (props) {
  return null
}

function defaultGetContainerId () {
  return this.containerId || `ReactComponent\$${this.webapp.name}`
}

function defaultGetContainerTag () {
  return this.containerTag || 'div'
}

function defaultHydrateToElement () {
  throw new Error('hydrateToElement() must be overridden')
}

function defaultRenderToString () {
  throw new Error('renderToString() must be overridden')
}

ReactRendererPlugin
  .defineOption('Component', {
    fallback: () => DefaultComponent,
    set: (plugin, path, value) => {
      Accessor.setIn(plugin, path, value)
      plugin.updateClients()
      return plugin
    }
  })
  .defineOption('containerId')
  .defineOption('containerTag')
  .defineOption('getContainerId', () => defaultGetContainerId)
  .defineOption('getContainerTag', () => defaultGetContainerTag)
  .defineOption('hydrateToElement', () => defaultHydrateToElement)
  .defineOption('renderToString', () => defaultRenderToString)

if (__BROWSER__) {
  const ReactDOM = require('react-dom')

  ReactRendererPlugin
    .defineOption('hydrateToElement', () => ReactDOM.hydrate)
}

if (__NODE__) {
  const ReactDOM = require('react-dom/server')

  ReactRendererPlugin
    .defineOption('renderToString', () => ReactDOM.renderToString)
}

module.exports = ReactRendererPlugin
