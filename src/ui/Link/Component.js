const React = require('react')

import Icon from '../Icon'

function Link (props) {
  let {
    'arial-label': ariaLabel,
    children,
    className,
    compacted,
    icon,
    tag = 'a',
    ...attributes
  } = props

  let text = children

  if (typeof text === 'string') {
    ariaLabel = ariaLabel || text

    text = React.createElement(
      'span',
      {key: 'text'},
      text
    )
  }

  if (typeof icon === 'string') {
    icon = Icon({
      key: 'icon',
      children: icon
    })
  }

  children= []

  icon && children.push(icon)
  text && (!compacted || !icon) && children.push(text)

  return React.createElement(tag, {
    ...attributes,
    'aria-label': ariaLabel,
    children,
    className
  })
}

export default Link
