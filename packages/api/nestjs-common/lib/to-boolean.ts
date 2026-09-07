/**
 * If value is a boolean, returns the boolean.
 * If the value is either the string "true" or "false", it returns true of false respectively.
 * Otherwise, throws. 
 */
export function toBoolean (value: unknown): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'boolean') return value
  throw new Error('Invalid boolean string')
}
