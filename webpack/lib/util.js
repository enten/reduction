const {readdirSync} = require('fs')
const {resolve} = require('path')

function compact (...args) {
  return [].concat(...args).filter((value) => value)
}

function getExternals (options = {}) {
  if (typeof options === 'string') {
    options = {context: options}
  }

  if (typeof options === 'function') {
    options = {filter: options}
  }

  if (typeof arguments[1] === 'function') {
    options = Object.assign({filter: arguments[1]}, options)
  }

  const context = options.context || process.cwd()
  const filter = options.filter || (() => true)
  const modulesDir = options.modulesDir || 'node_modules'
  const importType = options.importType || 'commonjs'

  return readdirSync(resolve(context, modulesDir))
    .filter(filter)
    .reduce((acc, mod) => {
      acc[mod] = [importType, mod].join(' ')

      return acc
    }, {})
}

function plugin (Plugin) {
  if (typeof Plugin === 'string') {
    Plugin = [Plugin]
  }

  if (Array.isArray(Plugin)) {
    Plugin = Plugin.reduce((mod, key) => mod[key], require(Plugin.shift()))
  }

  const args = [].slice.call(arguments, 1)

  if (args.length === 1)
    return new Plugin(args[0])
  if (args.length === 2)
    return new Plugin(args[0], args[1])
  if (args.length === 3)
    return new Plugin(args[0], args[1], args[2])
  if (args.length === 4)
    return new Plugin(args[0], args[1], args[2], args[3])
  if (args.length === 5)
    return new Plugin(args[0], args[1], args[2], args[3], args[4])
  if (args.length === 6)
    return new Plugin(args[0], args[1], args[2], args[3], args[4], args[5])
  if (args.length === 7)
    return new Plugin(args[0], args[1], args[2], args[3], args[4], args[5], args[6])
  if (args.length === 8)
    return new Plugin(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])
  if (args.length === 9)
    return new Plugin(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])

  return new Plugin()
}

Object.assign(exports, {
  compact,
  getExternals,
  plugin
})