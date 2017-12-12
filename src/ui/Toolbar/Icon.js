import React from 'react'
import classNames from 'classnames'

import THEME from './theme'

function ToolbarIcon (props) {
  let {
    className,
    menu,
    tag,
    theme,
    ...attributes
  } = props

  if (!tag) {
    tag = menu ? Link : 'span'
  }

  const th = {
    ...THEME,
    ...theme
  }

  const classes = classNames(
    menu ? th.menuIcon : th.icon,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    className: classes
  })
}

export default ToolbarIcon
