import React from 'react'
import classNames from 'classnames'

import THEME from './theme'

function ToolbarSection (props) {
  const {
    alignEnd,
    alignStart,
    className,
    shrinkToFit,
    tag = 'section',
    theme,
    ...attributes
  } = props

  const th = {
    ...THEME,
    ...theme
  }

  const classes = classNames(
    th.section,
    alignEnd && th.alignEnd,
    alignStart && th.alignStart,
    shrinkToFit && th.shrinkToFit,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    className: classes
  })
}

export default ToolbarSection
