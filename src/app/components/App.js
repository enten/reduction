import {AppContainer} from 'react-hot-loader'
import {Provider} from 'react-redux'
import React from 'react'
import {connect} from 'react-redux'
import universal from 'react-universal-component'

import Link, {NavLink} from 'redux-first-router-link'

import {
  Toolbar,
  ToolbarAdjust,
  ToolbarLink,
  ToolbarMenuIcon,
  ToolbarRow,
  ToolbarSection,
  ToolbarTitle
} from '../../ui/Toolbar'

import './App.styles.scss'

const UniversalComponent = universal(({page}) => import(`./${page}`), {
  minDelay: 200
})

const active = (currentPath, path) =>
  currentPath === path ? 'is-active' : ''

const SideBar = ({path, onClick}) => (
  <Toolbar>
    <ToolbarRow>
      <ToolbarSection alignStart>
        <ToolbarLink
          href="#"
          onClick={() => onClick('HOME')}
          className={active(path, '/')}
          >
          HOME
        </ToolbarLink>
        <ToolbarLink
          href="#"
          onClick={() => onClick('FOO')}
          className={active(path, '/foo')}
          >
          FOO
        </ToolbarLink>
        <ToolbarLink
          href="#"
          onClick={() => onClick('BAR')}
          className={active(path, '/bar')}
          >
          BAR
        </ToolbarLink>
      </ToolbarSection>
    </ToolbarRow>
  </Toolbar>
)

const SideBarConnected = connect(
  ({location}) => ({path: location.pathname}),
  {onClick: (page) => ({type: page})}
)(SideBar)

const Switcher = ({page, isLoading, store}) => (
  <AppContainer>
    <Provider store={store}>
      <div>
        <SideBarConnected />
        <ToolbarAdjust>
          <UniversalComponent page={page} />
        </ToolbarAdjust>
      </div>
    </Provider>
  </AppContainer>
)

const mapState = ({page, ...state}) => ({
  page
})

export default connect(mapState)(Switcher)
