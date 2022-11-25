/**
 * Converts Decimal to Hexadecimal
 * @param {Number} num 
 * @returns 
 */
 export function d2h(num) {
    return +(num.toString(16))
}

/**
 * Converts Hexadecimal to Decimal
 * @param {Number} num 
 * @returns 
 */
export function h2d(num) {
    return parseInt(num, 16)
}

/**
 * Capitalizes the first character of a String
 * @param {String} str - The string
 * @return {String}
 */
export function capitalize(str = '', all = false) {
    return str.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Production controlled debug
 * @param {Object} params
 */
export function log(...params) {
    if (new URLSearchParams(window.location.search).has('debug')) console.debug(...params)
}