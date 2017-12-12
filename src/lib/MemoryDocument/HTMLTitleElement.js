const DOMElement = require('min-document/dom-element')

class HTMLTitleElement extends DOMElement {
  constructor (owner, namespace) {
    super('TITLE', owner, namespace)

    this.innerHTML = ''
  }

  get text () {
    return this.innerHTML
  }

  set text (value) {
    this.innerHTML = value
  }
}

module.exports = HTMLTitleElement
