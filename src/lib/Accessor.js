function createAccessor (name, options = {}) {
  name = parseAccessorPath(name)
  options = parseAccessorOptions(options)

  if (!name || !name.length) {
    throw new Error('name invalid')
  }

  const parents = parseAccessorPath(options.parents || [])
  const path = [].concat(parents, name)

  const {
    default: defaultValue = defaultIn,
    has: hasValue = hasIn,
    fallback: fallbackValue = () => {},
    get: getValue = getIn,
    getLense,
    set: setValue = setIn,
    setLense,
    unset: unsetValue = unsetIn
  } = options

  return {
    default (value) {
      return defaultValue(this, path, value)
    },
    fallback () {
      return fallbackValue(this, path)
    },
    get (userFallback) {
      let getter = hasValue(this, path) ? getValue : userFallback || fallbackValue
      let value = getter(this, path)

      if (getLense) {
        value = getLense.call(this, value)
      }

      return value
    },
    has () {
      return hasValue(this, path)
    },
    set (value) {
      if (setLense) {
        value = setLense.call(this, value)
      }

      return setValue(this, path, value)
    },
    unset () {
      return unsetValue(this, path)
    }
  }
}

function createAccessorDescriptors (name, options) {
  options = parseAccessorOptions(options)

  if (name && typeof name === 'object') {
    return Object.keys(name).reduce((acc, key) => {
      let accessor = parseAccessorOptions(name[key])

      if (options) {
        accessor = Object.assign({}, options, accessor)
      }

      const accessorDescs = createAccessorDescriptors(key, accessor)

      Object.assign(acc, accessorDescs)

      return acc
    }, {})
  }

  name = parseAccessorPath(name)

  const accessor = createAccessor(name, options)
  const nameUcFirst = name.reduce((acc, part) =>  acc + part[0].toUpperCase() + part.substring(1), '')
  const descriptors = {}
  
  Object.keys(accessor).forEach((key) => {
    descriptors[key + nameUcFirst] = {
      configurable: true,
      enumerable: false,
      value: accessor[key],
      writable: true
    }
  })

  if (options && options.parents) {
    const nameCamel = name[0][0] + nameUcFirst.substring(1)

    descriptors[nameCamel] = {
      configurable: true,
      enumerable: false,
      get: accessor.get,
      set: accessor.set
    }
  }

  return descriptors
}

function defaultIn (obj, name, value) {
  return walkIn(obj, name, {
    parents: true,
    end: (acc, key) => {
      if (acc[key] == null) {
        acc[key] = value
      }

      return obj
    }
  })
}

function defineAccessor (obj, name, options) {
  const accessorDescriptors = createAccessorDescriptors(name, options)

  Object.defineProperties(obj, accessorDescriptors)

  return obj
}

function defineFor (obj, commonOption) {
  commonOption = parseAccessorOptions(commonOption)

  const api = {
    define (name, options) {
      options =  parseAccessorOptions(options)
      options = Object.assign({}, commonOption, options)

      defineAccessor(obj, name, options)

      return api
    }
  }

  if (arguments.length > 2) {
    return api.define(arguments[2], arguments[3])
  }

  return api
}

function getIn (obj, name, fallback) {
  return walkIn(obj, name, {
    end: (acc, key) => {
      if (acc && acc[key] != null) {
        return acc[key]
      }

      if (fallback) {
        return fallback(obj, name)
      }
    }
  })
}

function hasIn (obj, name) {
  return walkIn(obj, name, {
    end: (acc, key) => {
      return !!acc && acc[key] != null
    }
  })
}

function parseAccessorOptions (options = {}) {
  if (typeof options === 'string' || Array.isArray(options)) {
    options = {parents: options}
  }

  if (typeof options === 'function') {
    options = {fallback: options}
  }

  return options
}

function parseAccessorPath (path = []) {
  if (typeof path === 'string') {
    path = path.split('.')
  }

  return path
}

function setIn (obj, name, value) {
  return walkIn(obj, name, {
    parents: true,
    end: (acc, key) => {
      acc[key] = value

      return obj
    }
  })
}

function unsetIn (obj, name) {
  return walkIn(obj, name, {
    end: (acc, key) => {
      if (acc && acc.hasOwnProperty(key)) {
        delete acc[key]
      }

      return obj
    }
  })
}

function walkIn (obj, name, options) {
  name = parseAccessorPath(name)

  if (typeof options === 'function') {
    options = {end: options}
  }

  const {
    end,
    next,
    parents,
    tap
  } = options

  return name.reduce((acc, key, index, arr) => {
    const last = index + 1 >= arr.length

    if (acc && !acc[key] && parents && !last) {
      acc[key] = {}
    }

    tap && tap(acc, key, index, arr, last)

    if (last && end) {
      return end(acc, key, index, arr)
    }

    if (next) {
      return next(acc, key, index, arr)
    }

    return acc ? acc[key] : undefined
  }, obj)
}

Object.assign(exports, {
  create: createAccessor,
  createAccessor,
  createAccessorDescriptors,
  createDescriptors: createAccessorDescriptors,
  defaultIn,
  define: defineAccessor,
  defineFor,
  defineAccessor,
  getIn,
  for: defineFor,
  hasIn,
  parseAccessorPath,
  parseAccessorOptions,
  setIn,
  unsetIn,
  walkIn
})
