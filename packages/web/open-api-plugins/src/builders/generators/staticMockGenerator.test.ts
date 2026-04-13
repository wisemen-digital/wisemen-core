import {
  describe,
  expect,
  it,
} from 'vitest'

import type { Schema } from '../types'
import { generateStaticMockCode } from './staticMockGenerator'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const EMAIL_REGEX = /@/
const URI_REGEX = /^https?:\/\//
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

describe('static Mock Generator', () => {
  describe('generateStaticMockCode', () => {
    it('generates correct mock for string with email format', () => {
      const schema: Schema = {
        format: 'email',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Email')

      expect(result).toBe('"user@example.com"')
    })

    it('generates correct mock for string with uuid format', () => {
      const schema: Schema = {
        format: 'uuid',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'UUID')

      expect(result).toBe('"550e8400-e29b-41d4-a716-446655440000"')
    })

    it('generates correct mock for string with url format', () => {
      const schema: Schema = {
        format: 'url',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'URL')

      expect(result).toBe('"https://example.com"')
    })

    it('generates correct mock for string with date format', () => {
      const schema: Schema = {
        format: 'date',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Date')

      expect(result).toBe('"2024-01-01"')
    })

    it('generates correct mock for string with date-time format', () => {
      const schema: Schema = {
        format: 'date-time',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'DateTime')

      expect(result).toBe('"2024-01-01T00:00:00.000Z"')
    })

    it('generates correct mock for plain string', () => {
      const schema: Schema = {
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'String')

      expect(result).toBe('"aaaaa"')
    })

    it('respects minLength for strings', () => {
      const schema: Schema = {
        minLength: 10,
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'String')

      expect(result).toBe('"aaaaaaaaaa"')
    })

    it('generates correct mock for number', () => {
      const schema: Schema = {
        maximum: 100,
        minimum: 0,
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'Number')

      expect(result).toBe('50')
    })

    it('generates correct mock for integer', () => {
      const schema: Schema = {
        maximum: 10,
        minimum: 0,
        type: 'integer',
      }
      const result = generateStaticMockCode(schema, 'Integer')

      expect(result).toBe('5')
    })

    it('generates correct mock for boolean', () => {
      const schema: Schema = {
        type: 'boolean',
      }
      const result = generateStaticMockCode(schema, 'Boolean')

      expect(result).toBe('true')
    })

    it('generates correct mock for enum', () => {
      const schema: Schema = {
        enum: [
          'active',
          'inactive',
          'pending',
        ],
      }
      const result = generateStaticMockCode(schema, 'Status')

      expect(result).toBe('"active"')
    })

    it('generates correct mock for array', () => {
      const schema: Schema = {
        items: {
          type: 'string',
        },
        type: 'array',
      }
      const result = generateStaticMockCode(schema, 'StringArray')

      expect(result).toBe('["aaaaa"]')
    })

    it('generates correct mock for simple object', () => {
      const schema: Schema = {
        properties: {
          id: {
            format: 'uuid',
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        required: [
          'id',
          'name',
        ],
        type: 'object',
      }
      const result = generateStaticMockCode(schema, 'User')

      expect(result).toContain('id: "550e8400-e29b-41d4-a716-446655440000"')
      expect(result).toContain('name: "aaaaa"')
    })

    it('only includes required properties in objects', () => {
      const schema: Schema = {
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          optional: {
            type: 'string',
          },
        },
        required: [
          'id',
          'name',
        ],
        type: 'object',
      }
      const result = generateStaticMockCode(schema, 'User')

      expect(result).toContain('id:')
      expect(result).toContain('name:')
      expect(result).not.toContain('optional:')
    })

    it('handles nested objects', () => {
      const schema: Schema = {
        properties: {
          user: {
            properties: {
              id: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
            required: [
              'id',
            ],
            type: 'object',
          },
        },
        required: [
          'user',
        ],
        type: 'object',
      }
      const result = generateStaticMockCode(schema, 'Wrapper')

      expect(result).toContain('user:')
      expect(result).toContain('id:')
    })

    it('uses default value if provided', () => {
      const schema: Schema = {
        default: 'default-value',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'String')

      expect(result).toBe('"default-value"')
    })

    it('uses example value if provided', () => {
      const schema: Schema = {
        examples: [
          42,
        ],
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'Number')

      expect(result).toBe('42')
    })

    it('handles const value in schema default/example', () => {
      const schema: Schema = {
        default: 'constant-value',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Const')

      expect(result).toBe('"constant-value"')
    })

    it('handles oneOf schemas', () => {
      const schema: Schema = {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      }
      const result = generateStaticMockCode(schema, 'Union')

      expect(result).toBe('null')
    })

    it('handles anyOf schemas with enums', () => {
      const schema: Schema = {
        anyOf: [
          {
            const: 'value1',
          },
          {
            const: 'value2',
          },
        ],
      }
      const result = generateStaticMockCode(schema, 'AnyUnion')

      expect(result).toBe('"value1"')
    })

    it('handles allOf schemas', () => {
      const schema: Schema = {
        allOf: [
          {
            properties: {
              name: {
                type: 'string',
              },
            },
            type: 'object',
          },
          {
            properties: {
              age: {
                type: 'number',
              },
            },
            type: 'object',
          },
        ],
      }
      const result = generateStaticMockCode(schema, 'Combined')

      expect(result).toBe('null')
    })

    it('handles number with minimum constraint', () => {
      const schema: Schema = {
        minimum: 100,
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'MinNum')
      const value = Number(result)

      expect(value).toBeGreaterThanOrEqual(100)
    })

    it('handles number with maximum constraint', () => {
      const schema: Schema = {
        maximum: 10,
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'MaxNum')
      const value = Number(result)

      expect(value).toBeLessThanOrEqual(10)
    })

    it('handles integer type specifically', () => {
      const schema: Schema = {
        type: 'integer',
      }
      const result = generateStaticMockCode(schema, 'Int')
      const value = Number(result)

      expect(Number.isInteger(value)).toBeTruthy()
    })

    it('handles string with minLength', () => {
      const schema: Schema = {
        minLength: 20,
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'LongString')
      const unquoted = result.slice(1, -1)

      expect(unquoted.length).toBeGreaterThanOrEqual(20)
    })

    it('handles string with maxLength', () => {
      const schema: Schema = {
        maxLength: 5,
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'ShortString')
      const unquoted = result.slice(1, -1)

      expect(unquoted.length).toBeLessThanOrEqual(5)
    })

    it('handles string with pattern as placeholder', () => {
      const schema: Schema = {
        pattern: '^[0-9]{3}$',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Pattern')

      expect(result).toBe('"pattern-match"')
    })

    it('handles uuid format', () => {
      const schema: Schema = {
        format: 'uuid',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'UUID')
      const unquoted = result.slice(1, -1)

      expect(
        UUID_REGEX.test(unquoted),
      ).toBeTruthy()
    })

    it('handles email format', () => {
      const schema: Schema = {
        format: 'email',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Email')
      const unquoted = result.slice(1, -1)

      expect(unquoted).toMatch(EMAIL_REGEX)
    })

    it('handles uri/url format', () => {
      const schema: Schema = {
        format: 'uri',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'URI')
      const unquoted = result.slice(1, -1)

      expect(unquoted).toMatch(URI_REGEX)
    })

    it('handles date-time format', () => {
      const schema: Schema = {
        format: 'date-time',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'DateTime')
      const unquoted = result.slice(1, -1)

      expect(!Number.isNaN(Date.parse(unquoted))).toBeTruthy()
    })

    it('handles date format', () => {
      const schema: Schema = {
        format: 'date',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Date')
      const unquoted = result.slice(1, -1)

      expect(DATE_REGEX.test(unquoted)).toBeTruthy()
    })

    it('handles time format with fallback', () => {
      const schema: Schema = {
        format: 'time',
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'Time')

      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('handles array with minItems', () => {
      const schema: Schema = {
        items: {
          type: 'number',
        },
        minItems: 5,
        type: 'array',
      }
      const result = generateStaticMockCode(schema, 'MinArray')
      const arr = JSON.parse(result)

      expect(arr.length).toBeGreaterThanOrEqual(5)
    })

    it('handles array with maxItems', () => {
      const schema: Schema = {
        items: {
          type: 'string',
        },
        maxItems: 2,
        type: 'array',
      }
      const result = generateStaticMockCode(schema, 'MaxArray')
      const arr = JSON.parse(result)

      expect(arr.length).toBeLessThanOrEqual(2)
    })

    it('handles null type', () => {
      const schema: Schema = {
        type: 'null',
      }
      const result = generateStaticMockCode(schema, 'Null')

      expect(result).toBe('null')
    })

    it('handles nullable string', () => {
      const schema: Schema = {
        nullable: true,
        type: 'string',
      }
      const result = generateStaticMockCode(schema, 'NullableString')

      expect(typeof result).toBe('string')
    })

    it('handles empty object without properties', () => {
      const schema: Schema = {
        type: 'object',
      }
      const result = generateStaticMockCode(schema, 'EmptyObj')

      expect(result).toBe('{}')
    })

    it('handles complex nested structures', () => {
      const schema: Schema = {
        properties: {
          users: {
            items: {
              properties: {
                profile: {
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                  required: [
                    'name',
                  ],
                  type: 'object',
                },
              },
              required: [
                'profile',
              ],
              type: 'object',
            },
            type: 'array',
          },
        },
        required: [
          'users',
        ],
        type: 'object',
      }
      const result = generateStaticMockCode(schema, 'Nested')

      expect(result).toContain('users:')
      expect(result).toContain('profile:')
      expect(result).toContain('name:')
    })

    it('handles schema without type', () => {
      const schema: Schema = {}
      const result = generateStaticMockCode(schema, 'Unknown')

      expect(result).toBeTruthy()
    })

    it('handles multipleOf constraint for numbers', () => {
      const schema: Schema = {
        multipleOf: 5,
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'Multiple')
      const value = Number(result)

      expect(value % 5).toBe(0)
    })

    it('handles number constraints with min and max', () => {
      const schema: Schema = {
        maximum: 20,
        minimum: 10,
        type: 'number',
      }
      const result = generateStaticMockCode(schema, 'Constrained')
      const value = Number(result)

      expect(value).toBeGreaterThanOrEqual(10)
      expect(value).toBeLessThanOrEqual(20)
    })
  })
})
