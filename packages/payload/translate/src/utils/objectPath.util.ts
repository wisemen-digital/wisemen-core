export function getValueAtPath(object: Record<string, unknown>, path: string[]): unknown {
  return path.reduce<unknown>((currentValue, segment) => {
    if (!isPlainObject(currentValue)) {
      // eslint-disable-next-line array-callback-return
      return
    }

    return currentValue[segment]
  }, object)
}

export function setValueAtPath(object: Record<string, unknown>, path: string[], value: unknown): void {
  const lastSegment = path.at(-1)

  if (!lastSegment) {
    return
  }

  let currentObject = object

  for (const segment of path.slice(0, -1)) {
    const currentValue = currentObject[segment]

    if (!isPlainObject(currentValue)) {
      currentObject[segment] = {}
    }

    currentObject = currentObject[segment] as Record<string, unknown>
  }

  currentObject[lastSegment] = value
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
