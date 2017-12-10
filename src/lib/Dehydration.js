const MemoryDocument = require('./MemoryDocument')
const Hydration = require('./Hydration')

class Dehydration extends Hydration {
  constructor (options) {
    super(options)

    this.doc = this.createMemoryDocument()
  }

  bodyToString () {
    return String(this.doc.body.childNodes)
  }

  headToString () {
    return String(this.doc.head.childNodes)
  }

  htmlToString () {
    const {
      doctype,
      documentElement
    } = this.doc

    return doctype.toString() + documentElement.toString()
  }
}

function defaultCreateMemoryDocument () {
  return new MemoryDocument()
}

Dehydration
  .defineOption('createMemoryDocument', () => defaultCreateMemoryDocument)
  .defineOption('next')
  .defineOption('req')
  .defineOption('res')

module.exports = Dehydration
