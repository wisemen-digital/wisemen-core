import type { JsonValue } from '../types'

export function getEnumValues(items: any[]): JsonValue[] {
  const enumValues: JsonValue[] = []

  if (Array.isArray(items)) {
    for (const item of items) {
      if (item && typeof item === 'object' && 'const' in item) {
        enumValues.push((item as { const: JsonValue }).const)
      }
    }
  }

  return enumValues
}

export function inferEnumType(enumValues: JsonValue[]): 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string' {
  const primitiveTypes = new Set(enumValues.map((v) => (v === null ? 'null' : typeof v)))
  let inferred: 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'
    = primitiveTypes.size === 1
      ? (
          [
            ...primitiveTypes,
          ][0] as 'array' | 'boolean' | 'null' | 'number' | 'object' | 'string'
        )
      : 'string'

  if (inferred === 'number') {
    if (enumValues.every((v) => typeof v === 'number' && Number.isInteger(v))) {
      inferred = 'integer'
    }
  }

  if (inferred === 'object') {
    inferred = 'string'
  }

  return inferred
}
