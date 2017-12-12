import React from 'react'
import classNames from 'classnames'

import THEME from './theme'

function ToolbarAdjust (props) {
  const {
    className,
    tag = 'div',
    theme,
    ...attributes
  } = props

  const th = {
    ...THEME,
    ...theme
  }

  const classes = classNames(
    th.adjust,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    className: classes
  })
}

export default ToolbarAdjust
