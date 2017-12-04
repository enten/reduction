const Accessor = require('../../Accessor')
const React = require('react')
const RendererPlugin = require('./RendererPlugin')

class ReactRendererPlugin extends RendererPlugin {
  constructor (options) {
    super(options)

    this.clients = []
  }

  apply (webapp) {
    super.apply(webapp)

    webapp.plugin('new-rehydration', (rehydration) => {
      this.clients.push(rehydration)
    })
  }

  updateClients () {
    return Promise.all(
      this.clients.map((rehydration) => rehydration.rehydrate())
    )
  }
}

function defaultComponent (props, context, updater) {
  throw new Error('Component() must be overridden')
}

function defaultContainer ({store, ...props}, context, updater) {
  if (store) {
    props = {...props, 'data-store-key': store.exportKey}
  }

  return React.createElement('div', props)
}

function defaultDehydrate (dehydration, done) {
  const {
    Component,
    ComponentProps,
    Container,
    ContainerProps
  } = this

  const element = this.createElement(Component, ComponentProps(dehydration))
  let raw = this.renderToString(element)

  if (Container) {
    const container = this.createElement(Container, {
      ...ContainerProps(dehydration),
      dangerouslySetInnerHTML: {__html: raw}
    })

    raw = this.renderToStaticMarkup(container)
  }

  dehydration.appendBody(raw)

  done()
}

function defaultGetContainerId (hydration) {
  return hydration.name
}

function defaultHydrateToElement () {
  throw new Error('hydrateToElement() must be overridden')
}

function defaultProps () {
  return {}
}

function defaultRehydrate (rehydration, done) {
  const {
    Component,
    ComponentProps
  } = this

  const element = this.createElement(Component, ComponentProps(rehydration))
  const containerId = this.getContainerId(rehydration)
  const container = rehydration.win.document.getElementById(containerId)

  this.hydrateToElement(element, container, done)
}

function defaultRenderToStaticMarkup () {
  throw new Error('renderToStaticMarkup() must be overridden')
}

function defaultRenderToString () {
  throw new Error('renderToString() must be overridden')
}

function getLenseComponentProps (getProps) {
  return getLenseProps.call(this, getProps)
}

function getLenseContainerProps (getProps) {
  getProps = getLenseProps.call(this, getProps)

  return (hydration) => {
    const containerId = this.getContainerId(hydration)
    const props = getProps(hydration)

    return Object.assign({}, props, {
      id: containerId
    })
  }
}

function getLenseProps (getProps) {
  return (hydration) => {
    const props = getProps(hydration)

    if (!props.store) {
      const store = this.getStore(hydration)

      if (store) {
        return Object.assign({store}, props)
      }
    }

    return props
  }
}

ReactRendererPlugin.defineOptions({
  Component: {
    fallback: () => defaultComponent,
    set: (plugin, path, value) => {
      Accessor.setIn(plugin, path, value)
      plugin.updateClients()
      return plugin
    }
  },
  ComponentProps: {
    fallback: () => defaultProps,
    getLense: getLenseComponentProps
  },
  Container: () => defaultContainer,
  ContainerProps: {
    fallback: () => defaultProps,
    getLense: getLenseContainerProps
  },
  createElement: () => React.createElement,
  dehydrate: () => defaultDehydrate,
  getContainerId: () => defaultGetContainerId,
  hydrateToElement: () => defaultHydrateToElement,
  rehydrate: () => defaultRehydrate,
  renderToStaticMarkup: () => defaultRenderToStaticMarkup,
  renderToString: () => defaultRenderToString,
})

if (__BROWSER__) {
  const ReactDOM = require('react-dom')

  ReactRendererPlugin
    .defineOption('hydrateToElement', () => ReactDOM.hydrate)
}

if (__NODE__) {
  const ReactDOM = require('react-dom/server')

  ReactRendererPlugin.defineOptions({
    renderToStaticMarkup: () => ReactDOM.renderToStaticMarkup,
    renderToString: () => ReactDOM.renderToString,
  })
}

module.exports = ReactRendererPlugin
