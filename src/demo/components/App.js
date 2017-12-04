const {Provider} = require('react-redux')
import React from 'react'

import DevTools from './DevTools'
import Sidebar from './Sidebar'
import Switcher from './Switcher'

import styles from '../css/App'

export default ({store}) =>
  <Provider store={store}>
    <div>
      <div className={styles.app}>
        <Sidebar />
        <Switcher />
      </div>

      <DevTools />
    </div>
  </Provider>
