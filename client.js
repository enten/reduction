import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'

import AppContainer from 'react-hot-loader/lib/AppContainer'
import WebApp from './webapp'

const history = createHistory()

const renderWebapp = (CurrentWebApp) => {
  const webapp= (
    <AppContainer>
      <CurrentWebApp history={history} />
    </AppContainer>
  )

  ReactDOM.hydrate(webapp, document.getElementById('webapp'))
}

if (module.hot) {
  module.hot.accept('./webapp/index.js', () => {
    const LatestWebApp = require('./webapp/index.js').default

    renderWebapp(LatestWebApp)
  })
}

renderWebapp(WebApp)
