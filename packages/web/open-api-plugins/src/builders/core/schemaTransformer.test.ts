import type { IR } from '@hey-api/openapi-ts'
import {
  describe,
  expect,
  it,
} from 'vitest'

import type { NormalizedSchemaNode } from '../types'
import {
  collectSchemas,
  irToSchema,
  normalizeSchema,
  sanitizeSchema,
} from './schemaTransformer'

const SCHEMA_SUFFIX_REGEX = /Schema$/

describe('schema Transformer', () => {
  describe('irToSchema', () => {
    it('converts simple string schema', () => {
      const ir: IR.SchemaObject = {
        type: 'string',
      }
      const result = irToSchema(ir, {})

      expect(result).toEqual({
        type: 'string',
      })
    })

    it('converts object schema with properties', () => {
      const ir: IR.SchemaObject = {
        properties: {
          name: {
            type: 'string',
          },
        },
        type: 'object',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('type', 'object')
      expect(result).toHaveProperty('properties')
    })

    it('handles required fields', () => {
      const ir: IR.SchemaObject = {
        properties: {
          name: {
            type: 'string',
          },
        },
        required: [
          'name',
        ],
        type: 'object',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('required')
      expect(result.required).toEqual([
        'name',
      ])
    })

    it('handles $ref references', () => {
      const all: Record<string, IR.SchemaObject> = {
        User: {
          properties: {
            name: {
              type: 'string',
            },
          },
          type: 'object',
        },
      }
      const ir: IR.SchemaObject = {
        $ref: '#/components/schemas/User',
      }
      const result = irToSchema(ir, all)

      expect(result).toHaveProperty('type', 'object')
      expect(result).toHaveProperty('properties')
    })

    it('handles nullable fields', () => {
      const ir = {
        nullable: true,
        type: 'string',
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result.type).toEqual([
        'string',
        'null',
      ])
    })

    it('infers type from properties', () => {
      const ir: IR.SchemaObject = {
        properties: {
          name: {
            type: 'string',
          },
        },
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('type', 'object')
    })

    it('infers type from items', () => {
      const ir: IR.SchemaObject = {
        items: [
          {
            type: 'string',
          },
        ],
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('type', 'array')
    })

    it('handles array items', () => {
      const ir: IR.SchemaObject = {
        items: [
          {
            type: 'string',
          },
        ],
        type: 'array',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('items')
    })

    it('handles additionalProperties boolean', () => {
      const ir: IR.SchemaObject = {
        additionalProperties: false,
        type: 'object',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('additionalProperties', false)
    })

    it('handles additionalProperties schema', () => {
      const ir: IR.SchemaObject = {
        additionalProperties: {
          type: 'string',
        },
        type: 'object',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('additionalProperties')
      expect(result.additionalProperties).toHaveProperty('type', 'string')
    })

    it('copies format property', () => {
      const ir: IR.SchemaObject = {
        format: 'uuid',
        type: 'string',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('format', 'uuid')
    })

    it('copies pattern property', () => {
      const ir: IR.SchemaObject = {
        pattern: '^[A-Z]+$',
        type: 'string',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('pattern', '^[A-Z]+$')
    })

    it('copies min/max properties for strings', () => {
      const ir: IR.SchemaObject = {
        maxLength: 100,
        minLength: 5,
        type: 'string',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('minLength', 5)
      expect(result).toHaveProperty('maxLength', 100)
    })

    it('copies min/max properties for numbers', () => {
      const ir: IR.SchemaObject = {
        maximum: 100,
        minimum: 0,
        type: 'number',
      }
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('minimum', 0)
      expect(result).toHaveProperty('maximum', 100)
    })

    it('converts example to examples array', () => {
      const ir = {
        example: 'test-value',
        type: 'string',
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('examples')
      expect(result.examples).toEqual([
        'test-value',
      ])
    })

    it('handles circular references without infinite loop', () => {
      const ir: IR.SchemaObject = {
        type: 'object',
      }
      const seen = new Set<IR.SchemaObject>()

      seen.add(ir)

      const result = irToSchema(ir, {}, seen)

      expect(result).toEqual({})
    })

    it('returns empty object for null input', () => {
      const result = irToSchema(null as unknown as IR.SchemaObject, {})

      expect(result).toEqual({})
    })

    it('returns empty object for non-object input', () => {
      const result = irToSchema('string' as IR.SchemaObject, {})

      expect(result).toEqual({})
    })

    it('handles enum with type enum and items', () => {
      const ir = {
        items: [
          {
            const: 'value1',
          },
          {
            const: 'value2',
          },
          {
            const: 'value3',
          },
        ],
        type: 'enum',
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('anyOf')
      expect(result.anyOf).toHaveLength(3)
    })

    it('handles enum with items but no enum property', () => {
      const ir = {
        items: [
          {
            const: 'red',
          },
          {
            const: 'blue',
          },
          {
            const: 'green',
          },
        ],
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('anyOf')
      expect(result.anyOf).toHaveLength(3)
    })

    it('handles nullable arrays with union types', () => {
      const ir = {
        nullable: true,
        type: [
          'string',
          'null',
        ],
      } as unknown as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result.type).toEqual([
        'string',
        'null',
      ])
    })

    it('handles allOf composition', () => {
      const ir = {
        allOf: [
          {
            properties: {
              a: {
                type: 'string',
              },
            },
            type: 'object',
          },
          {
            properties: {
              b: {
                type: 'number',
              },
            },
            type: 'object',
          },
        ],
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('allOf')
      expect(result.allOf).toHaveLength(2)
    })

    it('handles anyOf composition', () => {
      const ir = {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('anyOf')
      expect(result.anyOf).toHaveLength(2)
    })

    it('handles oneOf composition', () => {
      const ir = {
        oneOf: [
          {
            type: 'boolean',
          },
          {
            type: 'string',
          },
        ],
      } as IR.SchemaObject
      const result = irToSchema(ir, {})

      expect(result).toHaveProperty('oneOf')
      expect(result.oneOf).toHaveLength(2)
    })
  })

  describe('normalizeSchema', () => {
    it('normalizes basic schema', () => {
      const schema: NormalizedSchemaNode = {
        type: 'string',
      }
      const result = normalizeSchema(schema)

      expect(result).toHaveProperty('type', 'string')
    })

    it('normalizes nested properties', () => {
      const schema: NormalizedSchemaNode = {
        properties: {
          nested: {
            type: 'string',
          },
        },
        type: 'object',
      }
      const result = normalizeSchema(schema)

      expect(result.properties).toBeDefined()
      expect(result.properties?.nested).toHaveProperty('type', 'string')
    })

    it('normalizes enum type with items', () => {
      const schema: NormalizedSchemaNode = {
        items: [
          {
            const: 'value1',
          },
          {
            const: 'value2',
          },
        ],
        type: 'enum',
      }
      const result = normalizeSchema(schema)

      expect(result.enum).toEqual([
        'value1',
        'value2',
      ])
      expect(result.type).toBe('string')
    })

    it('normalizes enum type with number items', () => {
      const schema: NormalizedSchemaNode = {
        items: [
          {
            const: 1,
          },
          {
            const: 2,
          },
          {
            const: 3,
          },
        ],
        type: 'enum',
      }
      const result = normalizeSchema(schema)

      expect(result.enum).toEqual([
        1,
        2,
        3,
      ])
      expect(result.type).toBe('integer')
    })

    it('normalizes enum type with mixed types to string', () => {
      const schema: NormalizedSchemaNode = {
        items: [
          {
            const: 'text',
          },
          {
            const: 123,
          },
        ],
        type: 'enum',
      }
      const result = normalizeSchema(schema)

      expect(result.enum).toEqual([
        'text',
        123,
      ])
      expect(result.type).toBe('string')
    })

    it('normalizes enum type with no valid items', () => {
      const schema: NormalizedSchemaNode = {
        items: [],
        type: 'enum',
      }
      const result = normalizeSchema(schema)

      expect(result.type).toBe('string')
    })

    it('normalizes array with enum items', () => {
      const schema: NormalizedSchemaNode = {
        properties: {
          values: {
            items: [
              {
                items: [
                  {
                    const: 'a',
                  },
                ],
                type: 'enum',
              },
              {
                items: [
                  {
                    const: 'b',
                  },
                ],
                type: 'enum',
              },
            ],
            type: 'array',
          },
        },
        type: 'object',
      }
      const result = normalizeSchema(schema)

      expect(result.properties?.values).toBeDefined()
    })

    it('normalizes array with mixed type items to anyOf', () => {
      const schema: NormalizedSchemaNode = {
        items: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
        ],
        type: 'array',
      }
      const result = normalizeSchema(schema)

      expect(result.anyOf).toBeDefined()
      expect(result).not.toHaveProperty('type')
    })

    it('normalizes nested items in array', () => {
      const schema: NormalizedSchemaNode = {
        properties: {
          data: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
        },
        type: 'object',
      }
      const result = normalizeSchema(schema)

      expect(result.properties?.data).toBeDefined()
    })

    it('normalizes allOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        allOf: [
          {
            type: 'string',
          },
        ],
        type: 'object',
      }
      const result = normalizeSchema(schema)

      expect(result.allOf).toBeDefined()
    })

    it('normalizes anyOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        anyOf: [
          {
            type: 'string',
          },
        ],
        type: 'object',
      }
      const result = normalizeSchema(schema)

      expect(result.anyOf).toBeDefined()
    })

    it('normalizes oneOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        type: 'object',
        oneOf: [
          {
            type: 'string',
          },
        ],
      }
      const result = normalizeSchema(schema)

      expect(result.oneOf).toBeDefined()
    })
  })

  describe('sanitizeSchema', () => {
    it('removes enum type and sets appropriate type', () => {
      const schema: NormalizedSchemaNode = {
        enum: [
          'value1',
          'value2',
        ],
        type: 'enum',
      }
      const result = sanitizeSchema(schema)

      expect(result.type).toBe('string')
      expect(result.enum).toEqual([
        'value1',
        'value2',
      ])
    })

    it('removes IR.SchemaObject type', () => {
      const schema: NormalizedSchemaNode = {
        type: 'unknown',
      } as unknown as NormalizedSchemaNode
      const result = sanitizeSchema(schema)

      expect(result).not.toHaveProperty('type')
    })

    it('removes logicalOperator property', () => {
      const schema: NormalizedSchemaNode = {
        logicalOperator: 'AND',
        type: 'string',
      }
      const result = sanitizeSchema(schema)

      expect(result).not.toHaveProperty('logicalOperator')
    })

    it('sanitizes nested properties', () => {
      const schema: NormalizedSchemaNode = {
        properties: {
          field: {
            enum: [
              'val',
            ],
            type: 'enum',
          },
        },
        type: 'object',
      }
      const result = sanitizeSchema(schema)

      expect(result.properties?.field).not.toHaveProperty('type', 'enum')
    })

    it('sanitizes arrays', () => {
      const schema: NormalizedSchemaNode = {
        items: {
          type: 'unknown',
        },
        type: 'array',
      } as unknown as NormalizedSchemaNode
      const result = sanitizeSchema(schema)

      expect(result.items).toBeDefined()
    })

    it('sets type to string when enum exists without type', () => {
      const schema: NormalizedSchemaNode = {
        enum: [
          'a',
          'b',
          'c',
        ],
      }
      const result = sanitizeSchema(schema)

      expect(result.type).toBe('string')
    })

    it('sanitizes additionalProperties', () => {
      const schema: NormalizedSchemaNode = {
        additionalProperties: {
          type: 'object',
        },
        type: 'object',
      }
      const result = sanitizeSchema(schema)

      expect(result.additionalProperties).toBeDefined()
    })

    it('sanitizes array items when items is array', () => {
      const schema: NormalizedSchemaNode = {
        items: [
          {
            enum: [
              'val1',
            ],
            type: 'enum',
          },
          {
            type: 'string',
          },
        ],
        type: 'array',
      }
      const result = sanitizeSchema(schema)

      expect(result.items).toBeDefined()
      expect(Array.isArray(result.items)).toBeTruthy()

      const items = result.items as NormalizedSchemaNode[]

      expect(items[0]).not.toHaveProperty('type', 'enum')
    })

    it('sanitizes allOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        allOf: [
          {
            enum: [
              'val',
            ],
            type: 'enum',
          },
        ],
        type: 'object',
      }
      const result = sanitizeSchema(schema)

      expect(result.allOf).toBeDefined()
    })

    it('sanitizes anyOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        anyOf: [
          {
            type: 'string',
          },
        ],
        type: 'object',
      }
      const result = sanitizeSchema(schema)

      expect(result.anyOf).toBeDefined()
    })

    it('sanitizes oneOf schemas', () => {
      const schema: NormalizedSchemaNode = {
        type: 'object',
        oneOf: [
          {
            enum: [
              'x',
            ],
            type: 'enum',
          },
        ],
      }
      const result = sanitizeSchema(schema)

      expect(result.oneOf).toBeDefined()
    })
  })

  describe('collectSchemas', () => {
    it('collects and processes multiple schemas', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        ProductSchema: {
          properties: {
            price: {
              type: 'number',
            },
          },
          type: 'object',
        },
        UserSchema: {
          properties: {
            name: {
              type: 'string',
            },
          },
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result).toHaveLength(2)
      expect(result[0].typeName).toBe('Product')
      expect(result[1].typeName).toBe('User')
    })

    it('removes Schema suffix from type names', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        UserSchema: {
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].typeName).toBe('User')
    })

    it('normalizes type names', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        APIKey: {
          type: 'object',
        },
        UITheme: {
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].typeName).toBe('ApiKey')
      expect(result[1].typeName).toBe('UiTheme')
    })

    it('identifies object types correctly', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        ObjectType: {
          type: 'object',
        },
        StringType: {
          type: 'string',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].isObject).toBeTruthy()
      expect(result[1].isObject).toBeFalsy()
    })

    it('generates safe constant names', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        'My-Schema': {
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].constName).toMatch(SCHEMA_SUFFIX_REGEX)
      expect(result[0].constName).not.toContain('-')
    })

    it('handles schemas with $ref', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Address: {
          type: 'object',
        },
        User: {
          properties: {
            address: {
              $ref: '#/components/schemas/Address',
            },
          },
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result).toHaveLength(2)
    })

    it('handles schemas with additionalProperties', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        DynamicObject: {
          additionalProperties: {
            type: 'string',
          },
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result).toHaveLength(1)
      expect(result[0].schema.additionalProperties).toBeDefined()
    })

    it('handles schemas with required array', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        User: {
          properties: {
            id: {
              type: 'number',
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
      }

      const result = collectSchemas(schemas)

      expect(result[0].schema.required).toEqual([
        'id',
      ])
    })

    it('handles oneOf schemas', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Mixed: {
          oneOf: [
            {
              type: 'string',
            },
            {
              type: 'number',
            },
          ],
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.oneOf).toBeDefined()
    })

    it('handles anyOf schemas', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Flexible: {
          anyOf: [
            {
              type: 'string',
            },
            {
              type: 'boolean',
            },
          ],
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.anyOf).toBeDefined()
    })

    it('handles allOf schemas', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Combined: {
          allOf: [
            {
              properties: {
                a: {
                  type: 'string',
                },
              },
              type: 'object',
            },
            {
              properties: {
                b: {
                  type: 'number',
                },
              },
              type: 'object',
            },
          ],
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.allOf).toBeDefined()
    })

    it('handles array schemas with min/max items', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        LimitedArray: {
          items: {
            type: 'string',
          },
          maxItems: 10,
          minItems: 1,
          type: 'array',
        },
      } as unknown as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.minItems).toBe(1)
      expect(result[0].schema.maxItems).toBe(10)
    })

    it('handles number schemas with constraints', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        ConstrainedNumber: {
          maximum: 100,
          minimum: 0,
          multipleOf: 5,
          type: 'number',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('ConstrainedNumber')
    })

    it('handles string schemas with format and pattern', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        FormattedString: {
          format: 'email',
          maxLength: 50,
          minLength: 5,
          pattern: '^[a-z]+@[a-z]+\\.[a-z]+$',
          type: 'string',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('FormattedString')
    })

    it('handles nested object schemas', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Nested: {
          properties: {
            inner: {
              properties: {
                value: {
                  type: 'string',
                },
              },
              type: 'object',
            },
          },
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].schema.properties?.inner).toBeDefined()
    })

    it('handles schemas with description and title', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Documented: {
          title: 'Documented Schema',
          description: 'A well-documented schema',
          type: 'object',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].schema.title).toBe('Documented Schema')
      expect(result[0].schema.description).toBe('A well-documented schema')
    })

    it('handles schemas with nullable', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Nullable: {
          nullable: true,
          type: 'string',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('Nullable')
    })

    it('handles schemas with deprecated flag', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Old: {
          deprecated: true,
          type: 'string',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.deprecated).toBeTruthy()
    })

    it('handles schemas with readOnly flag', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        ReadOnly: {
          properties: {
            id: {
              readOnly: true,
              type: 'number',
            },
          },
          type: 'object',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.properties?.id.readOnly).toBeTruthy()
    })

    it('handles schemas with writeOnly flag', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        WriteOnly: {
          properties: {
            password: {
              type: 'string',
              writeOnly: true,
            },
          },
          type: 'object',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.properties?.password.writeOnly).toBeTruthy()
    })

    it('handles schemas with examples', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        WithExamples: {
          examples: [
            'example1',
            'example2',
          ],
          type: 'string',
        },
      } as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('WithExamples')
    })

    it('handles schemas with default values', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        WithDefault: {
          default: 'default-value',
          type: 'string',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('WithDefault')
    })

    it('handles schemas with const values', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Constant: {
          const: 'fixed',
          type: 'string',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0]).toBeDefined()
      expect(result[0].typeName).toBe('Constant')
    })

    it('handles complex nested structures', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Complex: {
          properties: {
            users: {
              items: {
                properties: {
                  name: {
                    type: 'string',
                  },
                  roles: {
                    items: {
                      enum: [
                        'admin',
                        'user',
                        'guest',
                      ],
                      type: 'string',
                    },
                    type: 'array',
                  },
                },
                type: 'object',
              },
              type: 'array',
            },
          },
          type: 'object',
        },
      } as unknown as Record<string, IR.SchemaObject>

      const result = collectSchemas(schemas)

      expect(result[0].schema.properties?.users).toBeDefined()
    })

    it('handles schemas with exclusive minimum and maximum', () => {
      const schemas: Record<string, IR.SchemaObject> = {
        Exclusive: {
          exclusiveMaximum: 100,
          exclusiveMinimum: 0,
          type: 'number',
        },
      }

      const result = collectSchemas(schemas)

      expect(result[0].schema.exclusiveMinimum).toBe(0)
      expect(result[0].schema.exclusiveMaximum).toBe(100)
    })
  })
})
