/**
 * Checks if an array is empty
 * @param {array} array
 * @returns {boolean}
 */
const isArrayNotNull = (array: number | string[] | object[]): boolean => Array.isArray(array) && Object.keys(array).length > 0;

export default isArrayNotNull;
