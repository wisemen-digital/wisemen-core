import type { IR } from '@hey-api/openapi-ts'
import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  isEnum,
  isJsonValue,
  isObjectType,
} from './schemaValidators'

describe('schema Validators', () => {
  describe('isEnum', () => {
    it('returns true for schema with enum property', () => {
      const schema = {
        enum: [
          'value1',
          'value2',
          'value3',
        ],
      } as unknown as IR.SchemaObject

      expect(isEnum(schema)).toBeTruthy()
    })

    it('returns true for schema with type enum', () => {
      const schema = {
        items: [
          {
            const: 'value1',
          },
          {
            const: 'value2',
          },
        ],
        type: 'enum',
      } as unknown as IR.SchemaObject

      expect(isEnum(schema)).toBeTruthy()
    })

    it('returns true for schema with items array of const values', () => {
      const schema = {
        items: [
          {
            const: 'value1',
          },
          {
            const: 'value2',
          },
        ],
      } as unknown as IR.SchemaObject

      expect(isEnum(schema)).toBeTruthy()
    })

    it('returns false for non-enum schema', () => {
      const schema: IR.SchemaObject = {
        type: 'string',
      }

      expect(isEnum(schema)).toBeFalsy()
    })

    it('returns false for null or undefined', () => {
      expect(isEnum(null as unknown as IR.SchemaObject)).toBeFalsy()
      expect(isEnum(undefined as unknown as IR.SchemaObject)).toBeFalsy()
    })
  })

  describe('isJsonValue', () => {
    it('returns true for null', () => {
      expect(isJsonValue(null)).toBeTruthy()
    })

    it('returns true for primitives', () => {
      expect(isJsonValue('string')).toBeTruthy()
      expect(isJsonValue(123)).toBeTruthy()
      expect(isJsonValue(true)).toBeTruthy()
      expect(isJsonValue(false)).toBeTruthy()
    })

    it('returns true for arrays of JSON values', () => {
      expect(isJsonValue([
        1,
        2,
        3,
      ])).toBeTruthy()
      expect(isJsonValue([
        'a',
        'b',
        'c',
      ])).toBeTruthy()
      expect(isJsonValue([
        true,
        false,
      ])).toBeTruthy()
    })

    it('returns true for objects with JSON values', () => {
      expect(isJsonValue({
        a: 1,
        b: 'test',
      })).toBeTruthy()
      expect(isJsonValue({
        nested: {
          value: 123,
        },
      })).toBeTruthy()
    })

    it('returns false for functions', () => {
      expect(isJsonValue(() => {})).toBeFalsy()
    })

    it('returns false for symbols', () => {
      expect(isJsonValue(Symbol('test'))).toBeFalsy()
    })

    it('returns false for undefined', () => {
      expect(isJsonValue()).toBeFalsy()
    })
  })

  describe('isObjectType', () => {
    it('returns true for "object" type', () => {
      expect(isObjectType('object')).toBeTruthy()
    })

    it('returns true for array containing "object"', () => {
      expect(isObjectType([
        'object',
        'null',
      ])).toBeTruthy()
      expect(isObjectType([
        'string',
        'object',
      ])).toBeTruthy()
    })

    it('returns false for other types', () => {
      expect(isObjectType('string')).toBeFalsy()
      expect(isObjectType('number')).toBeFalsy()
      expect(isObjectType([
        'string',
        'number',
      ])).toBeFalsy()
    })

    it('returns false for undefined', () => {
      expect(isObjectType()).toBeFalsy()
    })
  })
})
