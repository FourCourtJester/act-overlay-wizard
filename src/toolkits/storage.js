// Import core components
// ...

// Import our components
// ...

const storage = localStorage
const namespace = 'ffxiv.wizard'

function _namespace(str) {
  return [namespace, ...(Array.isArray(str) ? str : [str])].join('.')
}

/**
 * Get the item from storage
 * @param {String} name
 */
export function get(name) {
  try {
    return JSON.parse(storage.getItem(_namespace([name])))
  } catch (err) {
    console.error(err)
  }
}

/**
 * Set the item into storage
 * @param {String} name
 * @param {*} obj
 */
export function set(name, obj) {
  storage.setItem(_namespace([name]), JSON.stringify(obj))
}

/**
 * Version check
 * @param {String} version
 */
export function wipe(version) {
  const cachedVersion = get('version')

  // If we have a new version, wipe all existing storage
  if (cachedVersion !== version) {
    Object.keys(storage).forEach((key) => {
      if (key.startsWith(namespace)) storage.removeItem(key)
    })
  }

  // Save the new version
  set('version', version)
}
