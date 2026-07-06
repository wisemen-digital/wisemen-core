export function exhaustiveCheck (_value: never): never {
  throw new Error('Unreachable code reached')
}