import React from 'react'

import Link from '../Link'
import ToolbarIcon from './Icon'

function ToolbarLink (props) {
  const {
    tag = Link,
    ...attributes
  } = props

  return React.createElement(ToolbarIcon, {
    ...attributes,
    tag
  })
}

export default ToolbarLink
