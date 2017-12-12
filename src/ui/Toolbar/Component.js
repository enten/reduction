import React from 'react'
import MDCToolbar from './MDComponent'

import ToolbarContainer from './Container'

class Toolbar extends React.Component {
  constructor () {
    super()

    this._onChange = this._onChange.bind(this)
  }

  _onChange (e) {
    const {onChange} = this.props

    onChange && onChange(e)
  }

  componentDidMount () {
    if (!this.mdc) {
      const {MDComponent} = this.props

      this.mdc = new this.props.MDComponent(this.domNode)
      this.mdc.listen('MDCToolbar:change', this._onChange)
    }
  }

  componentWillUnmount () {
    if (this.mdc) {
      this.mdc.unlisten("MDCToolbar:change", this._onChange)
      this.mdc.destroy()
      this.mdc = null
    }
  }

  render () {
    const {
      MDComponent, // omit MDComponent
      onChange, // omit onChange
      ...attributes
    } = this.props

    return ToolbarContainer({
      ...attributes,
      ref: (domNode) => {
        this.domNode = domNode
      }
    })
  }
}

Toolbar.defaultProps = {
  MDComponent: MDCToolbar
}

export default Toolbar