/**
 * Lodash <https://lodash.com/>
 * Released under MIT license <https://lodash.com/license>
 */
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reHasRegExpChar = new RegExp(reRegExpChar.source)

export function escapeRegExp(string = ''): string {
  return string && reHasRegExpChar.test(string)
    ? string.replaceAll(reRegExpChar, '\\$&')
    : string
}
