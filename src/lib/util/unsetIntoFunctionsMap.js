const callWithFunctionParam = require('./callWithFunctionParam')
const ensureHasProperty = require('./ensureHasProperty')

function unsetIntoFunctionsMap (obj, ...args) {
  if (Array.isArray(obj)) {
    const [wrapper, key] = obj

    ensureHasProperty(wrapper, key, {})

    obj = wrapper[key]
  }

  if (obj) {
    callWithFunctionParam(args, (fn, name) => {
      if (!name) {
        throw new Error('name missing')
      }

      if (typeof name !== 'string') {
        throw new Error('name wrong type (string expected)')
      }

      delete obj[name]
    })
  }

  return obj
}

module.exports = unsetIntoFunctionsMap
