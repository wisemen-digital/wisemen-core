import type { IR } from '@hey-api/openapi-ts'

import type {
  EnumItem,
  EnumSchemaObject,
  JsonValue,
} from '../types'

/**
 * Schema validation utilities
 */

/**
 * Checks if a schema represents an enum type
 * @param ir - Schema object to check
 * @returns True if schema is an enum
 */
export function isEnum(ir: IR.SchemaObject): boolean {
  if (!ir || typeof ir !== 'object') {
    return false
  }
  const enumIr = ir as EnumSchemaObject

  if (Array.isArray(enumIr.enum)) {
    return true
  }

  if (enumIr.type === 'enum') {
    return true
  }

  if (!enumIr.enum && Array.isArray(enumIr.items)) {
    const items = enumIr.items as EnumItem[]

    if (
      items.length > 0
      && items.every((it: EnumItem) => it && typeof it === 'object' && 'const' in it)
    ) {
      return true
    }
  }

  return false
}

/**
 * Checks if a value is a valid JSON value
 * @param value - Value to check
 * @returns True if valid JSON value
 */
export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) {
    return true
  }
  const type = typeof value

  if (type === 'string' || type === 'number' || type === 'boolean') {
    return true
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue)
  }
  if (type === 'object') {
    return Object.values(value as object).every(isJsonValue)
  }

  return false
}

/**
 * Checks if a schema represents an object type
 * @param type - Schema type
 * @returns True if object type
 */
export function isObjectType(type: string | string[] | undefined): boolean {
  if (type === 'object') {
    return true
  }
  if (Array.isArray(type) && type.includes('object')) {
    return true
  }

  return false
}
