const React = require('react')
import classNames from 'classnames'

const THEME = 'material-icons'

function Icon (props) {
  let {
    'aria-hidden': ariaHidden = true,
    className,
    tag = 'i',
    theme = THEME,
    ...attributes
  } = props

  const classes = classNames(
    theme,
    className
  )

  return React.createElement(tag, {
    ...attributes,
    'aria-hidden': ariaHidden,
    className: classes
  })
}

export {
  Icon as default,
  Icon
}
