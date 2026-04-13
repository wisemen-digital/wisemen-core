import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { Schema } from '../types'
import {
  generateMockFromZodSchema,
  generateZodSchema,
} from './zodMockGenerator'

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const URL_REGEX = /^https?:\/\/.+/
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
const PHONE_REGEX = /^\+1\d{10}$/

describe('zod Mock Generator', () => {
  describe('generateZodSchema', () => {
    it('generates z.string() for string type', () => {
      const schema: Schema = {
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string()')
    })

    it('generates z.number() for number type', () => {
      const schema: Schema = {
        type: 'number',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.number()')
    })

    it('generates z.number().int() for integer type', () => {
      const schema: Schema = {
        type: 'integer',
      }
      const result = generateZodSchema(schema)

      expect(result).toContain('z.number().int()')
    })

    it('generates z.boolean() for boolean type', () => {
      const schema: Schema = {
        type: 'boolean',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.boolean()')
    })

    it('generates z.null() for null type', () => {
      const schema: Schema = {
        type: 'null',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.null()')
    })

    it('handles string with uuid format', () => {
      const schema: Schema = {
        format: 'uuid',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().uuid()')
    })

    it('handles string with email format', () => {
      const schema: Schema = {
        format: 'email',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().email()')
    })

    it('handles string with url format', () => {
      const schema: Schema = {
        format: 'url',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().url()')
    })

    it('handles string with date format', () => {
      const schema: Schema = {
        format: 'date',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().date()')
    })

    it('handles string with date-time format', () => {
      const schema: Schema = {
        format: 'date-time',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().datetime()')
    })

    it('handles string with phone format', () => {
      const schema: Schema = {
        format: 'phone',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toContain('z.string().regex')
      expect(result).toContain('\\+?[1-9]\\d{1,14}')
    })

    it('handles string with minLength', () => {
      const schema: Schema = {
        minLength: 5,
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().min(5)')
    })

    it('handles string with maxLength', () => {
      const schema: Schema = {
        maxLength: 100,
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.string().max(100)')
    })

    it('handles string with pattern', () => {
      const schema: Schema = {
        pattern: '^[A-Z]+$',
        type: 'string',
      }
      const result = generateZodSchema(schema)

      expect(result).toContain('.regex(/^[A-Z]+$/)')
    })

    it('handles number with minimum', () => {
      const schema: Schema = {
        minimum: 0,
        type: 'number',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.number().min(0)')
    })

    it('handles number with maximum', () => {
      const schema: Schema = {
        maximum: 100,
        type: 'number',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.number().max(100)')
    })

    it('handles number with exclusive minimum', () => {
      const schema: Schema = {
        exclusiveMinimum: 0,
        type: 'number',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.number().gt(0)')
    })

    it('handles number with exclusive maximum', () => {
      const schema: Schema = {
        exclusiveMaximum: 100,
        type: 'number',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.number().lt(100)')
    })

    it('handles object with properties', () => {
      const schema: Schema = {
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
      const result = generateZodSchema(schema)

      expect(result).toContain('z.object({')
      expect(result).toContain('name: z.string()')
      expect(result).toContain('age: z.number().optional()')
    })

    it('handles array type', () => {
      const schema: Schema = {
        items: {
          type: 'string',
        },
        type: 'array',
      }
      const result = generateZodSchema(schema)

      expect(result).toBe('z.array(z.string())')
    })

    it('handles array with minItems', () => {
      const schema: Schema = {
        items: {
          type: 'string',
        },
        minItems: 1,
        type: 'array',
      }
      const result = generateZodSchema(schema)

      expect(result).toContain('.min(1)')
    })

    it('handles array with maxItems', () => {
      const schema: Schema = {
        items: {
          type: 'string',
        },
        maxItems: 10,
        type: 'array',
      }
      const result = generateZodSchema(schema)

      expect(result).toContain('.max(10)')
    })
  })

  describe('generateMockFromZodSchema', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    describe('primitive types', () => {
      it('generates mock for z.string()', () => {
        const zodSchema = 'z.string()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toBeTruthy()
      })

      it('generates mock for z.number()', () => {
        const zodSchema = 'z.number()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
      })

      it('generates mock for z.boolean()', () => {
        const zodSchema = 'z.boolean()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('boolean')
      })

      it('generates null for z.null()', () => {
        const zodSchema = 'z.null()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })

      it('omits null when omitNulls option is true', () => {
        const zodSchema = 'z.null()'
        const result = generateMockFromZodSchema(zodSchema, {}, {
          omitNulls: true,
        })

        expect(result).toBeUndefined()
      })
    })

    describe('string validations', () => {
      it('generates email for z.string().email()', () => {
        const zodSchema = 'z.string().email()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(EMAIL_REGEX)
      })

      it('generates UUID for z.string().uuid()', () => {
        const zodSchema = 'z.string().uuid()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(UUID_REGEX)
      })

      it('generates URL for z.string().url()', () => {
        const zodSchema = 'z.string().url()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(URL_REGEX)
      })

      it('generates date for z.string().date()', () => {
        const zodSchema = 'z.string().date()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(DATE_REGEX)
      })

      it('generates datetime for z.string().datetime()', () => {
        const zodSchema = 'z.string().datetime()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(DATETIME_REGEX)
      })

      it('generates string with min length for z.string().min()', () => {
        const zodSchema = 'z.string().min(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect((result as string).length).toBeGreaterThanOrEqual(10)
      })

      it('generates string with max length for z.string().max()', () => {
        const zodSchema = 'z.string().max(5)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect((result as string).length).toBeLessThanOrEqual(5)
      })
    })

    describe('number validations', () => {
      it('generates number with min for z.number().min()', () => {
        const zodSchema = 'z.number().min(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeGreaterThanOrEqual(10)
      })

      it('generates number with max for z.number().max()', () => {
        const zodSchema = 'z.number().max(100)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeLessThanOrEqual(100)
      })

      it('generates integer for z.number().int()', () => {
        const zodSchema = 'z.number().int()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(Number.isInteger(result as number)).toBeTruthy()
      })

      it('generates number greater than for z.number().gt()', () => {
        const zodSchema = 'z.number().gt(5)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeGreaterThan(5)
      })

      it('generates number less than for z.number().lt()', () => {
        const zodSchema = 'z.number().lt(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeLessThan(10)
      })
    })

    describe('enum types', () => {
      it('generates mock for z.enum()', () => {
        const zodSchema = 'z.enum(["active", "inactive", "pending"])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'active',
          'inactive',
          'pending',
        ]).toContain(result)
      })

      it('generates mock for single value enum', () => {
        const zodSchema = 'z.enum(["single"])'
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBe('single')
      })
    })

    describe('array types', () => {
      it('generates empty array when items schema cannot be parsed', () => {
        const zodSchema = 'z.array(z.string())'
        const result = generateMockFromZodSchema(zodSchema)

        expect(Array.isArray(result)).toBeTruthy()
      })

      it('generates array with overrides using items property', () => {
        const zodSchema = 'z.array(z.string())'
        const result = generateMockFromZodSchema(zodSchema, {
          items: [
            'a',
            'b',
            'c',
          ],
        })

        expect(Array.isArray(result)).toBeTruthy()
        expect(result).toEqual([
          'a',
          'b',
          'c',
        ])
      })

      it('respects maxItems constraint when specified', () => {
        const zodSchema = 'z.array(z.string()).max(2)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(Array.isArray(result)).toBeTruthy()
        expect((result as unknown[]).length).toBeLessThanOrEqual(2)
      })

      it('generates array with default length between min and max', () => {
        const zodSchema = 'z.array(z.number())'
        const result = generateMockFromZodSchema(zodSchema)

        expect(Array.isArray(result)).toBeTruthy()

        expect((result as unknown[]).length).toBeGreaterThanOrEqual(1)
        expect((result as unknown[]).length).toBeLessThanOrEqual(3)
      })
    })

    describe('object types', () => {
      it('generates mock for z.object()', () => {
        const zodSchema = 'z.object({ name: z.string(), age: z.number() })'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('age')
        expect(typeof (result as Record<string, unknown>).name).toBe('string')
        expect(typeof (result as Record<string, unknown>).age).toBe('number')
      })

      it('handles optional fields', () => {
        const zodSchema = 'z.object({ name: z.string(), age: z.number().optional() })'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('name')
      })

      it('always includes optionals when alwaysIncludeOptionals is true', () => {
        const zodSchema = 'z.object({ name: z.string(), age: z.number().optional() })'
        const result = generateMockFromZodSchema(zodSchema, {}, {
          alwaysIncludeOptionals: true,
        })

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('age')
      })

      it('handles nested objects', () => {
        const zodSchema = 'z.object({ user: z.object({ name: z.string(), email: z.string() }) })'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('user')
        expect(typeof (result as Record<string, unknown>).user).toBe('object')
        expect((result as Record<string, Record<string, unknown>>).user).toHaveProperty('name')
        expect((result as Record<string, Record<string, unknown>>).user).toHaveProperty('email')
      })

      it('handles properties with special characters', () => {
        const zodSchema = 'z.object({ "user-name": z.string(), "my.email": z.string() })'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('user-name')
        expect(result).toHaveProperty('my.email')
      })

      it('applies overrides to object properties', () => {
        const zodSchema = 'z.object({ name: z.string(), age: z.number() })'
        const result = generateMockFromZodSchema(zodSchema, {
          name: 'John',
          age: 30,
        })

        expect((result as Record<string, unknown>).name).toBe('John')
        expect((result as Record<string, unknown>).age).toBe(30)
      })

      it('applies partial overrides', () => {
        const zodSchema = 'z.object({ name: z.string(), age: z.number() })'
        const result = generateMockFromZodSchema(zodSchema, {
          name: 'John',
        })

        expect((result as Record<string, unknown>).name).toBe('John')
        expect(result).toHaveProperty('age')
        expect(typeof (result as Record<string, unknown>).age).toBe('number')
      })
    })

    describe('union types', () => {
      it('generates mock for z.union()', () => {
        const zodSchema = 'z.union([z.string(), z.number()])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'string',
          'number',
        ]).toContain(typeof result)
      })

      it('handles nullable unions', () => {
        const zodSchema = 'z.union([z.string(), z.null()])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'string',
          'object',
        ]).toContain(typeof result)
      })

      it('omits null in nullable unions when omitNulls is true', () => {
        const zodSchema = 'z.union([z.string(), z.null()])'
        const result = generateMockFromZodSchema(zodSchema, {}, {
          omitNulls: true,
        })

        expect(typeof result).toBe('string')
      })
    })

    describe('complex nested schemas', () => {
      it('generates mock for complex object structure', () => {
        const zodSchema = `z.object({
          id: z.string().uuid(),
          user: z.object({
            name: z.string(),
            email: z.string().email(),
            age: z.number().int().min(0).max(120)
          }),
          tags: z.array(z.string()),
          status: z.enum(["active", "inactive"]),
          metadata: z.object({
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime()
          }).optional()
        })`
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('user')
        expect(result).toHaveProperty('tags')
        expect(result).toHaveProperty('status')

        const obj = result as Record<string, unknown>

        expect(typeof obj.id).toBe('string')
        expect(obj.id).toMatch(UUID_REGEX)
        expect(Array.isArray(obj.tags)).toBeTruthy()
        expect([
          'active',
          'inactive',
        ]).toContain(obj.status)
      })

      it('generates array using overrides for simple types', () => {
        const zodSchema = `z.array(z.number())`
        const result = generateMockFromZodSchema(zodSchema, {
          items: [
            1,
            2,
            3,
          ],
        })

        expect(Array.isArray(result)).toBeTruthy()
        expect((result as unknown[])).toHaveLength(3)
        expect(result).toEqual([
          1,
          2,
          3,
        ])
      })
    })

    describe('options handling', () => {
      it('respects optionalsProbability option', () => {
        const zodSchema
          = 'z.object({ optional1: z.string().optional(), optional2: z.string().optional(), optional3: z.string().optional() })'

        vi.spyOn(Math, 'random').mockReturnValue(0.9)

        const result1 = generateMockFromZodSchema(zodSchema, {}, {
          optionalsProbability: 0,
        })

        expect(Object.keys(result1).filter((k) => k.startsWith('optional'))).toHaveLength(0)

        vi.spyOn(Math, 'random').mockReturnValue(0.5)

        const result2 = generateMockFromZodSchema(zodSchema, {}, {
          optionalsProbability: 1,
        })

        expect(Object.keys(result2).filter((k) => k.startsWith('optional'))).toHaveLength(3)
      })

      it('handles optionalsProbability as false', () => {
        const zodSchema = 'z.object({ optional: z.string().optional() })'

        vi.spyOn(Math, 'random').mockReturnValue(0.5)

        const result = generateMockFromZodSchema(zodSchema, {}, {
          optionalsProbability: false,
        })

        expect(typeof result).toBe('object')
      })
    })

    describe('edge cases', () => {
      it('handles empty object schema', () => {
        const zodSchema = 'z.object({})'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')
        expect(Object.keys(result as Record<string, unknown>)).toHaveLength(0)
      })

      it('handles unknown schema types', () => {
        const zodSchema = 'z.unknown()'
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })

      it('handles malformed schema strings gracefully', () => {
        const zodSchema = 'not a valid schema'
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })

      it('handles deeply nested property paths', () => {
        const zodSchema = `z.object({
          level1: z.object({
            level2: z.object({
              level3: z.object({
                value: z.string()
              })
            })
          })
        })`
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('object')

        const obj = result as Record<string, unknown>

        expect(obj).toHaveProperty('level1')
      })

      it('generates consistent mock values with overrides', () => {
        const zodSchema = 'z.object({ a: z.string(), b: z.string(), c: z.string() })'
        const overrides = {
          b: 'fixed-value',
        }
        const result = generateMockFromZodSchema(zodSchema, overrides)

        expect((result as Record<string, unknown>).b).toBe('fixed-value')
        expect(typeof (result as Record<string, unknown>).a).toBe('string')
        expect(typeof (result as Record<string, unknown>).c).toBe('string')
      })

      it('handles empty string schema', () => {
        const zodSchema = ''
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })

      it('handles string with only whitespace', () => {
        const zodSchema = '   '
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })

      it('handles numeric enum values', () => {
        const zodSchema = 'z.enum([1, 2, 3])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          1,
          2,
          3,
        ]).toContain(result)
      })

      it('handles boolean enum values', () => {
        const zodSchema = 'z.enum([true, false])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          true,
          false,
        ]).toContain(result)
      })

      it('handles mixed type enum values', () => {
        const zodSchema = 'z.enum(["active", 1, true])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'active',
          1,
          true,
        ]).toContain(result)
      })
    })

    describe('string regex patterns', () => {
      it('generates phone number for phone regex pattern', () => {
        const zodSchema = 'z.string().regex(/^\\+?[1-9]\\d{1,14}$/)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(PHONE_REGEX)
      })

      it('generates random string for custom regex pattern', () => {
        const zodSchema = 'z.string().regex(/^[A-Z]{5}$/)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect((result as string)).toHaveLength(10)
      })
    })

    describe('string length constraints', () => {
      it('generates string respecting both min and max length', () => {
        const zodSchema = 'z.string().min(8).max(12)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')

        const len = (result as string).length

        expect(len).toBeGreaterThanOrEqual(8)
        expect(len).toBeLessThanOrEqual(12)
      })

      it('generates string with exact length when min equals max', () => {
        const zodSchema = 'z.string().min(10).max(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect((result as string)).toHaveLength(10)
      })
    })

    describe('number constraints', () => {
      it('handles number with both min and max', () => {
        const zodSchema = 'z.number().min(10).max(20)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeGreaterThanOrEqual(10)
        expect(result as number).toBeLessThanOrEqual(20)
      })

      it('handles number with both gt and lt', () => {
        const zodSchema = 'z.number().gt(5).lt(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeGreaterThan(5)
        expect(result as number).toBeLessThan(10)
      })

      it('handles integer with constraints', () => {
        const zodSchema = 'z.number().int().min(1).max(10)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(Number.isInteger(result as number)).toBeTruthy()
        expect(result as number).toBeGreaterThanOrEqual(1)
        expect(result as number).toBeLessThanOrEqual(10)
      })

      it('generates negative numbers when range is negative', () => {
        const zodSchema = 'z.number().min(-100).max(-50)'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('number')
        expect(result as number).toBeGreaterThanOrEqual(-100)
        expect(result as number).toBeLessThanOrEqual(-50)
      })
    })

    describe('union type variations', () => {
      it('handles union with multiple types', () => {
        const zodSchema = 'z.union([z.string(), z.number(), z.boolean()])'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'string',
          'number',
          'boolean',
        ]).toContain(typeof result)
      })

      it('handles union with complex types', () => {
        const zodSchema = 'z.union([z.string().email(), z.number().int()])'
        const result = generateMockFromZodSchema(zodSchema)

        expect(typeof result).toBe('string')
        expect(result).toMatch(EMAIL_REGEX)
      })

      it('handles union with empty array returns null', () => {
        const zodSchema = 'z.union([])'
        const result = generateMockFromZodSchema(zodSchema)

        expect(result).toBeNull()
      })
    })

    describe('nullable types', () => {
      it('handles nullable string', () => {
        const zodSchema = 'z.string().nullable()'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'string',
          'object',
        ]).toContain(typeof result)
      })

      it('handles nullable number', () => {
        const zodSchema = 'z.number().nullable()'
        const result = generateMockFromZodSchema(zodSchema)

        expect([
          'number',
          'object',
        ]).toContain(typeof result)
      })
    })
  })
})
