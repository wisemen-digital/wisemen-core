import {
  describe,
  expect,
  it,
} from 'vitest'

import { generateMock } from './mockRuntime'

const PATTERN_PLACEHOLDER_REGEX = /^x+$/
const EMAIL_PATTERN_REGEX = /@/
const URI_PATTERN_REGEX = /^https?:\/\//
const DATE_PATTERN_REGEX = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN_REGEX = /^\d{2}:\d{2}:\d{2}/

describe('custom Mock Runtime', () => {
  describe('generateMock', () => {
    it('generates mock from simple string schema', () => {
      const schema = {
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
    })

    it('generates mock from number schema', () => {
      const schema = {
        type: 'number',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('number')
    })

    it('generates mock from boolean schema', () => {
      const schema = {
        type: 'boolean',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('boolean')
    })

    it('generates mock from object schema', () => {
      const schema = {
        properties: {
          name: {
            type: 'string',
          },
          age: {
            type: 'number',
          },
        },
        required: [
          'name',
        ],
        type: 'object',
      }
      const result = generateMock<{ name: string
        age?: number }>(schema)

      expect(result).toHaveProperty('name')
      expect(typeof result.name).toBe('string')
    })

    it('generates mock from array schema', () => {
      const schema = {
        items: {
          type: 'string',
        },
        type: 'array',
      }
      const result = generateMock<string[]>(schema)

      expect(Array.isArray(result)).toBeTruthy()
    })

    it('respects enum values', () => {
      const schema = {
        enum: [
          'active',
          'inactive',
        ],
        type: 'string',
      }
      const result = generateMock<string>(schema)

      expect([
        'active',
        'inactive',
      ]).toContain(result)
    })

    it('uses default value when useDefault is true', () => {
      const schema = {
        default: 'default-value',
        type: 'string',
      }
      const result = generateMock<string>(schema, {
        useDefault: true,
      })

      expect(result).toBe('default-value')
    })

    it('uses example value when useExamples is true', () => {
      const schema = {
        examples: [
          'example-value',
        ],
        type: 'string',
      }
      const result = generateMock<string>(schema, {
        useExamples: true,
      })

      expect(result).toBe('example-value')
    })

    it('respects minLength for strings', () => {
      const schema = {
        minLength: 10,
        type: 'string',
      }
      const result = generateMock<string>(schema)

      expect(result.length).toBeGreaterThanOrEqual(10)
    })

    it('respects maxLength for strings', () => {
      const schema = {
        maxLength: 5,
        type: 'string',
      }
      const result = generateMock<string>(schema)

      expect(result.length).toBeLessThanOrEqual(5)
    })

    it('respects minimum for numbers', () => {
      const schema = {
        minimum: 10,
        type: 'number',
      }
      const result = generateMock<number>(schema)

      expect(result).toBeGreaterThanOrEqual(10)
    })

    it('respects maximum for numbers', () => {
      const schema = {
        maximum: 100,
        type: 'number',
      }
      const result = generateMock<number>(schema)

      expect(result).toBeLessThanOrEqual(100)
    })

    it('handles requiredOnly option', () => {
      const schema = {
        properties: {
          optional1: {
            type: 'string',
          },
          required1: {
            type: 'string',
          },
        },
        required: [
          'required1',
        ],
        type: 'object',
      }
      const result = generateMock<Record<string, unknown>>(schema, {
        requiredOnly: true,
      })

      expect(result).toHaveProperty('required1')
    })

    it('generates consistent types for schemas', () => {
      const schema = {
        properties: {
          id: {
            format: 'uuid',
            type: 'string',
          },
          count: {
            type: 'integer',
          },
          email: {
            format: 'email',
            type: 'string',
          },
        },
        required: [
          'id',
          'email',
          'count',
        ],
        type: 'object',
      }
      const result = generateMock<{ id: string
        count: number
        email: string }>(schema)

      expect(typeof result.id).toBe('string')
      expect(typeof result.email).toBe('string')
      expect(typeof result.count).toBe('number')
    })

    it('handles nested objects', () => {
      const schema = {
        properties: {
          user: {
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
          'user',
        ],
        type: 'object',
      }
      const result = generateMock<{ user: { name: string } }>(schema)

      expect(result).toHaveProperty('user')
      expect(result.user).toHaveProperty('name')
    })

    it('handles arrays of objects', () => {
      const schema = {
        items: {
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
        minItems: 1,
        type: 'array',
      }
      const result = generateMock<Array<{ name: string }>>(schema)

      expect(Array.isArray(result)).toBeTruthy()
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[0]).toHaveProperty('name')
    })

    it('handles null type', () => {
      const schema = {
        type: 'null',
      }
      const result = generateMock(schema)

      expect(result).toBeNull()
    })

    it('handles oneOf schemas', () => {
      const schema = {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      }
      const result = generateMock(schema)

      expect([
        'string',
        'number',
      ]).toContain(typeof result)
    })

    it('handles anyOf schemas', () => {
      const schema = {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      }
      const result = generateMock(schema)

      expect([
        'string',
        'number',
      ]).toContain(typeof result)
    })

    it('handles allOf schemas with merging', () => {
      const schema = {
        allOf: [
          {
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
      const result = generateMock<{ name: string
        age?: number }>(schema)

      expect(result).toHaveProperty('name')
      expect(typeof result.name).toBe('string')
    })

    it('respects minItems for arrays', () => {
      const schema = {
        items: {
          type: 'string',
        },
        minItems: 5,
        type: 'array',
      }
      const result = generateMock<string[]>(schema)

      expect(Array.isArray(result)).toBeTruthy()
      expect(result.length).toBeGreaterThanOrEqual(5)
    })

    it('respects maxItems for arrays', () => {
      const schema = {
        items: {
          type: 'string',
        },
        maxItems: 2,
        type: 'array',
      }
      const result = generateMock<string[]>(schema)

      expect(Array.isArray(result)).toBeTruthy()
      expect(result.length).toBeLessThanOrEqual(2)
    })

    it('handles integer type specifically', () => {
      const schema = {
        type: 'integer',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('number')
      expect(Number.isInteger(result)).toBeTruthy()
    })

    it('respects minimum for numbers (minimum: 100)', () => {
      const schema = {
        minimum: 100,
        type: 'number',
      }
      const result = generateMock(schema)

      expect(result).toBeGreaterThanOrEqual(100)
    })

    it('respects maximum for numbers (maximum: 10)', () => {
      const schema = {
        maximum: 10,
        type: 'number',
      }
      const result = generateMock(schema)

      expect(result).toBeLessThanOrEqual(10)
    })

    it('respects minLength for strings (minLength: 20)', () => {
      const schema = {
        minLength: 20,
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect((result as string).length).toBeGreaterThanOrEqual(20)
    })

    it('respects maxLength for strings (maxLength: 5) - second test', () => {
      const schema = {
        maxLength: 5,
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect((result as string).length).toBeLessThanOrEqual(5)
    })

    it('handles pattern for strings with placeholder', () => {
      const schema = {
        pattern: '^[0-9]{3}$',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')

      expect(result).toMatch(PATTERN_PLACEHOLDER_REGEX)
    })

    it('handles uuid format with placeholder', () => {
      const schema = {
        format: 'uuid',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')

      expect(result).toBe('00000000-0000-0000-0000-000000000000')
    })

    it('handles email format', () => {
      const schema = {
        format: 'email',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect(result).toMatch(EMAIL_PATTERN_REGEX)
    })

    it('handles uri format', () => {
      const schema = {
        format: 'uri',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect(result).toMatch(URI_PATTERN_REGEX)
    })

    it('handles date-time format', () => {
      const schema = {
        format: 'date-time',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect(!Number.isNaN(Date.parse(result as string))).toBeTruthy()
    })

    it('handles date format', () => {
      const schema = {
        format: 'date',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect(DATE_PATTERN_REGEX.test(result as string)).toBeTruthy()
    })

    it('handles time format', () => {
      const schema = {
        format: 'time',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
      expect(TIME_PATTERN_REGEX.test(result as string)).toBeTruthy()
    })

    it.todo('applies overrides to nested properties')

    it('handles schemas with const value', () => {
      const schema = {
        const: 'fixed-value',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(result).toBe('fixed-value')
    })

    it('handles schemas with default value', () => {
      const schema = {
        default: 'default-value',
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
    })

    it('handles schemas with examples', () => {
      const schema = {
        examples: [
          'example1',
          'example2',
        ],
        type: 'string',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('string')
    })

    it('handles deeply nested structures', () => {
      const schema = {
        properties: {
          level1: {
            properties: {
              level2: {
                properties: {
                  level3: {
                    type: 'string',
                  },
                },
                required: [
                  'level3',
                ],
                type: 'object',
              },
            },
            required: [
              'level2',
            ],
            type: 'object',
          },
        },
        required: [
          'level1',
        ],
        type: 'object',
      } as const

      const result = generateMock<{ level1: { level2: { level3: string } } }>(schema)

      expect(result.level1.level2.level3).toBeDefined()
      expect(typeof result.level1.level2.level3).toBe('string')
    })

    it('handles array within object within array', () => {
      const schema = {
        items: {
          properties: {
            tags: {
              items: {
                type: 'string',
              },
              type: 'array',
            },
          },
          required: [
            'tags',
          ],
          type: 'object',
        },
        type: 'array',
      }
      const result = generateMock<Array<{ tags: string[] }>>(schema)

      expect(Array.isArray(result)).toBeTruthy()
      expect(result.length).toBeGreaterThan(0)
      expect(Array.isArray(result[0].tags)).toBeTruthy()
    })

    it('returns null for unknown schema type', () => {
      const schema = {
        type: 'unknown-type' as unknown as 'string',
      }
      const result = generateMock(schema)

      expect(result).toBeNull()
    })

    it('handles exclusiveMinimum', () => {
      const schema = {
        exclusiveMinimum: 10,
        type: 'number',
      }
      const result = generateMock(schema)

      expect(result).toBeGreaterThan(10)
    })

    it('handles exclusiveMaximum', () => {
      const schema = {
        exclusiveMaximum: 10,
        type: 'number',
      }
      const result = generateMock(schema)

      expect(result).toBeLessThan(10)
    })

    it('handles multipleOf constraint', () => {
      const schema = {
        multipleOf: 5,
        type: 'number',
      }
      const result = generateMock(schema)

      expect((result as number) % 5).toBe(0)
    })

    it('handles empty object schema', () => {
      const schema = {
        properties: {},
        type: 'object',
      }
      const result = generateMock(schema)

      expect(typeof result).toBe('object')
      expect(result).toEqual({})
    })

    it('handles empty array items', () => {
      const schema = {
        items: {},
        type: 'array',
      }
      const result = generateMock(schema)

      expect(Array.isArray(result)).toBeTruthy()
    })
  })
})
