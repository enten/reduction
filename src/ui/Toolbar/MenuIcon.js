import React from 'react'

import ToolbarLink from './Link'

function ToolbarMenuIcon (props) {
  const {
    children,
    label,
    ...attributes
  } = props

  return React.createElement(ToolbarLink, {
    ...attributes,
    children: null,
    icon: children || 'menu',
    menu: true
  })
}

export default ToolbarMenuIcon
