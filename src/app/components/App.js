const {Provider} = require('react-redux')
import React from 'react'
import {connect} from 'react-redux'
import universal from 'react-universal-component'

import Link, {NavLink} from 'redux-first-router-link'

import styles from '../_styles'

const UniversalComponent = universal(({page}) => import(`./${page}`), {
  minDelay: 200
})

const SideBar = () => (
  <ul>
    <li>
      <NavLink to="/">HOME</NavLink>
    </li>
    <li>
      <NavLink to={{type: 'FOO'}}>FOO</NavLink>
    </li>
    <li>
      <NavLink to={{type: 'BAR'}}>BAR</NavLink>
    </li>
  </ul>
)

const Switcher = ({page, isLoading, store}) => (
  <Provider store={store}>
    <div>
      <SideBar />
      <UniversalComponent page={page} />
    </div>
  </Provider>
)

const mapState = ({page, ...state}) => ({
  page
})

export default connect(mapState)(Switcher)
