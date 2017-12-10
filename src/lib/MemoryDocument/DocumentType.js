const DOMElement = require('min-document/dom-element')

const DOCUMENT_TYPE_NODE = 10

class DocumentType extends DOMElement {
  constructor (tagName, owner, namespace) {
    super(tagName, owner, namespace)

    this.name = 'html'
    this.internalSubset = undefined
    this.publicId = ''
    this.systemId = ''
  }

  get nodeName () {
    return this.name
  }

  get tagName () {
    return undefined
  }

  get nodeType () {
    return DOCUMENT_TYPE_NODE
  }

  toString () {
    let doctype = `<!DOCTYPE ${this.name}`

    if (this.publicId) {
      doctype += ` PUBLIC "${this.publicId}"`
    }

    if (this.systemId) {
      doctype += ` "${this.systemId}"`
    }

    doctype += '>'

    return doctype
  }
}

module.exports = DocumentType
