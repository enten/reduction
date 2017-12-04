const callWithRawParam = require('./callWithRawParam')

function callWithFunctionParam (args, callback) {
  if (typeof args[0] === 'string') {
    args = args.slice(1, 2).concat(args[0], args.slice(2))
  }

  callWithRawParam(args, (fn, name) => {
    if (!name && typeof fn === 'function') {
      name = fn.name
    }

    callback(fn, name)
  })
}

module.exports = callWithFunctionParam