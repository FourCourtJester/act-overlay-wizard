/**
 * Capitalizes the first character of a String
 * @param {String} str - The string
 * @return {String}
 */
export function capitalize(str = '', all = false) {
    return str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Creates an object of dot notational paths
 * @param {Object} obj - The object to deconstruct
 * @param {String} [prefix] - The original prefix to start the dot notation
 * @return {Object}
 */
export function getObjPaths(obj = {}, prefix = '') {
    let new_obj = {}

    /**
     * Private function to recurse over the object
     * @param {Object} o - The object to deconstruct
     * @param {String} p - The original prefix to start the dot notation
     * @return {Object}
     */
    function getObjPathsRecurse(o, p) {
        // Do not recurse upon primitive objects
        if ((typeof o).toLowerCase() !== 'object') {
            new_obj[p] = o
            return new_obj
        }

        // Arrays
        if (Array.isArray(o)) {
            if (!o.length) {
                new_obj[p] = o
            } else {
                o.forEach((field, i) => {
                    new_obj = getObjPathsRecurse(field, p.length ? `${p}[${i}]` : `[${i}]`)
                })
            }
            return new_obj
        }

        // Recurse upon the Object
        for (const [key, field] of Object.entries(o)) {
            const new_key = p.length ? `${p}.${key}` : key

            switch ((typeof field).toLowerCase()) {
                // Objects require recursion with a new prefix
                case 'object':
                    if (field == null) new_obj[new_key] = field
                    else new_obj = getObjPathsRecurse(field, new_key)
                    break

                // A primitive value that we can assign
                default:
                    new_obj[new_key] = field
                    break
            }
        }

        return new_obj
    }

    // Recurse and return
    return getObjPathsRecurse(obj, prefix)
}

/**
 * Get the value of the path in an Object
 * @param {Object} obj - The object to traverse
 * @param {String} path - The path to the value
 * @param {Object} [opts] - Additional options
 * @param {Object} [opts.split=true]
 * @return {*}
 */
export function getObjValue(obj = {}, path = '', opts = { split: true }) {
    if (obj === undefined) return undefined

    // Convert the path to an Array if it is already not
    if (opts.split && !Array.isArray(path)) path = path.split('.')
    else if (!Array.isArray(path)) path = [path]

    // If the prop does not exist, return undefined
    // Otherwise, return the value
    return path.reduce((val, part) => {
        if (val?.[part] === undefined) return undefined
        return val[part]
    }, obj)
}

/**
 * Set the value of the path in an Object
 * @param {Object} obj - The object to traverse
 * @param {Array|String} [path] - The path to the value
 * @param {*} val - The value to store
 * @param {Object} [opts] - Additional options
 * @param {Object} [opts.split=true]
 * @return {Object}
 */
export function setObjValue(obj = {}, path = [], val = undefined, opts = { split: true }) {
    // Convert the path to an Array if it is already not
    if (opts.split && !Array.isArray(path)) path = path.split('.')
    else if (!Array.isArray(path)) path = [path]

    if (!path.length) {
        // Edge case: No path length. Just return
        return obj
    } else if (path.length === 1) {
        // When there is no more depth to recurse, assign the value
        obj[path] = val
        return obj
    }

    // Get the prop
    const field = path.shift()

    if (field.includes('[')) {
        // Array, not an Object
        const [short_field, key] = field.match(/\w+\b/g)

        // If the prop does not exist, create it
        if (!Object.prototype.hasOwnProperty.call(obj, short_field)) obj[short_field] = []

        // Instantiate the array index, if required
        if (!obj[short_field][key ? key : 0]) obj[short_field][key ? key : 0] = {}

        // Recurse
        obj[short_field][key] = setObjValue(obj[short_field][key], path, val)
    } else {
        // If the prop does not exist, create it
        if (!Object.prototype.hasOwnProperty.call(obj, field)) obj[field] = {}

        // Recurse
        obj[field] = setObjValue(obj[field], path, val)
    }

    return obj
}

/**
 * Production controlled debug
 * @param {Object} params
 */
export function log(...params) {
    if (new URLSearchParams(window.location.search).has('debug')) console.debug(...params)
}