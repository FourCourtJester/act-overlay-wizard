// Import core components
// import Promise from 'bluebird'

// Import our components
// import * as Utils from 'toolkits/utils'

const
    storage = localStorage,
    namespace = 'ffxiv.wizard'

function _namespace(str) {
    if (!Array.isArray(str)) str = [str]
    return [namespace,  ...str].join('.')
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
        return null
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
    const cached_version = get('version')

    // If we have a new version, wipe all existing storage
    if (cached_version !== version) {
        Object.keys(storage).forEach((key) => {
            if (key.startsWith(_namespace('action'))) storage.removeItem(key)
        })
    }

    // Save the new version
    set('version', version)
}