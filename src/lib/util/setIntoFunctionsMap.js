const callWithFunctionParam = require('./callWithFunctionParam')
const ensureHasProperty = require('./ensureHasProperty')

function setIntoFunctionsMap (obj, ...args) {
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

      if (!fn) {
        throw new Error('fn missing')
      }

      if (typeof fn !== 'function') {
        throw new Error('fn wrong type (function expected)')
      }

      obj[name] = fn
    })
  }

  return obj
}

module.exports = setIntoFunctionsMap
