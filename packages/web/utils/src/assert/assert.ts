/**
 * Asserts that a condition is truthy.
 * Throws a descriptive `Error` with the given message if the condition is falsy.
 * Replaces verbose `if (!val) throw new Error(...)` checks throughout the codebase.
 *
 * @example
 * assert(user !== null, 'User must not be null')
 * assert(items.length > 0, 'Items list must not be empty')
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

/**
 * Asserts that a value is neither `null` nor `undefined`.
 * Narrows the type to `NonNullable<T>` after the check.
 *
 * @example
 * const el = document.getElementById('root')
 * assertDefined(el, '#root element must exist in the DOM')
 * el.innerHTML = 'Hello' // el is now HTMLElement, not null
 */
export function assertDefined<T>(
  value: T,
  message: string,
): asserts value is NonNullable<T> {
  assert(value != null, message)
}

/**
 * Asserts that a code path is unreachable (exhaustive switch/if checks).
 * TypeScript will produce a compile-time error if any case is unhandled,
 * and this function throws at runtime if somehow reached.
 *
 * @example
 * type Direction = 'left' | 'right'
 * function move(direction: Direction) {
 *   switch (direction) {
 *     case 'left': return moveLeft()
 *     case 'right': return moveRight()
 *     default: assertNever(direction) // compile error if a case is missing
 *   }
 * }
 */
export function assertNever(value: never): never {
  throw new Error(`Unexpected value reached assertNever: ${JSON.stringify(value)}`)
}
