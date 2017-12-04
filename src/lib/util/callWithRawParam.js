function callWithRawParam ([obj, name], callback) {
  if (Array.isArray(obj)) {
    return obj.forEach((value, index) => callWithRawParam([value, index], callback))
  }

  if (obj && typeof obj === 'object') {
    return Object.keys(obj).forEach((key) => callWithRawParam([obj[key], key], callback))
  }

  callback(obj, name)
}

module.exports = callWithRawParam
