import React from 'react'
import ReactDOM from 'react-dom'

import AppContainer from 'react-hot-loader/lib/AppContainer'
import {Provider} from 'react-redux'

export default function hydrateAppFromHtml (containerId, store, Component, callback) {
  const container = document.getElementById(containerId)
  const element = (
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>
  )

  return ReactDOM.hydrate(element, container, callback)
}
