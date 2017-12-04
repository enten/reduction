function ensureHasProperty (obj, name, fallback) {
  if (obj && !obj.hasOwnProperty(name)) {
    obj[name] = fallback
  }

  return obj
}

module.exports = ensureHasProperty
