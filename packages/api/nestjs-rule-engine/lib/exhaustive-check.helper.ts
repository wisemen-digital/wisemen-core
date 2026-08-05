/**
 * Marks a switch branch as unreachable at runtime and in the type system.
 */
export function exhaustiveCheck (_x: never): never {
  throw new Error('This code should be unreachable')
}
