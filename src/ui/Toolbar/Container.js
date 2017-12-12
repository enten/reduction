import React from 'react'
import classNames from 'classnames'

import THEME from './theme'

function ToolbarContainer (props) {
  const {
    className,
    fixedAtLastRow,
    fixedLastRowOnly,
    flexibleDefaultBehavior,
    flexibleSpaceMaximized,
    flexibleSpaceMinimized,
    tag = 'header',
    theme,
    waterfall,
    ...attributes
  } = props

  const th = {
    ...THEME,
    ...theme
  }

  const fixed = isFixed(props)
  const flexible = isFlexible(props)

  const classes = classNames(
    th.root,
    fixed && th.fixed,
    fixedAtLastRow && th.fixedAtLastRow,
    fixedLastRowOnly && th.fixedLastRow,
    flexible && th.flexible,
    flexibleDefaultBehavior && th.flexibleDefaultBehavior,
    flexibleSpaceMaximized && th.flexibleMax,
    flexibleSpaceMinimized && th.flexibleMin,
    waterfall && th.waterfall,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    className: classes
  })
}

function isFixed (props) {
  return !!(
    props.fixed
    || props.fixedAtLastRow
    || props.fixedLastRowOnly
    || props.waterfall
  )
}

function isFlexible (props) {
  return !!(
    props.flexible
    || props.flexibleDefaultBehavior
    || props.flexibleSpaceMaximized
    || props.flexibleSpaceMinimized
  )
}

export {
  ToolbarContainer as default,
  ToolbarContainer,
  isFixed,
  isFlexible
}
