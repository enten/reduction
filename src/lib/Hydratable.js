const Hookable = require('./Hookable')

// let INSTANCE_COUNTERS = {}

class Hydratable extends Hookable {
  constructor (options) {
    super(options)

    // this.defaultId(this.generateId())
  }
}

function defaultDehydrate () {
  throw new Error('dehydrate() must be overridden')
}

// function defaultGenerateId () {
//   const {name} = this.constructor

//   if (!INSTANCE_COUNTERS.hasOwnProperty(name)) {
//     INSTANCE_COUNTERS[name] = 0
//   }

//   return name.concat('$', INSTANCE_COUNTERS[name]++)
// }

function defaultRehydrate () {
  throw new Error('rehydrate() must be overridden')
}

// Object.assign(Hydratable, {INSTANCE_COUNTERS})

Hydratable
  // .defineOption('id')
  .defineOption('dehydrate', () => defaultDehydrate)
  // .defineOption('generateId', () => defaultGenerateId)
  .defineOption('rehydrate', () => defaultRehydrate)

module.exports = Hydratable
