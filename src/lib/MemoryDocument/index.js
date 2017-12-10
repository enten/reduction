const Document = require('min-document/document')
const DocumentType = require('./DocumentType')
const HTMLTitleElement = require('./HTMLTitleElement')

class MemoryDocument extends Document {
  constructor () {
    super()

    this.doctype = new DocumentType()
  }

  get title () {
    const titleElement = this.getElementsByTagName('title')[0]

    return titleElement && titleElement.text || ''
  }

  set title (value) {
    let titleElement = this.getElementsByTagName('title')[0]

    if (!titleElement) {
      titleElement = new HTMLTitleElement()
      this.head.appendChild(titleElement)
    }

    titleElement.text = value
  }
}

module.exports = MemoryDocument
