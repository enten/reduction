import React from 'react'
import classNames from 'classnames'

import THEME from './theme'

function ToolbarTitle (props) {
  const {
    className,
    tag = 'span',
    theme,
    ...attributes
  } = props

  const th = {
    ...THEME,
    ...theme
  }

  const classes = classNames(
    th.title,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    className: classes
  })
}

export default ToolbarTitle
