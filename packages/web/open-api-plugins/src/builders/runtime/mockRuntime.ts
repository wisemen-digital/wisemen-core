import type { Schema } from '../types'

export interface MockOptions {
  alwaysIncludeOptionals?: boolean
  omitNulls?: boolean
  optionalsProbability?: number | false
  requiredOnly?: boolean
  useDefault?: boolean
  useExamples?: boolean
}

/**
 * Custom mock data generator for JSON schemas
 * This is a lightweight alternative to json-schema-faker
 */
export class MockGenerator {
  private options: Required<MockOptions>
  private seenRefs = new Set<string>()

  constructor(options: MockOptions = {}) {
    this.options = {
      alwaysIncludeOptionals: options.alwaysIncludeOptionals ?? false,
      omitNulls: options.omitNulls ?? false,
      optionalsProbability: options.optionalsProbability ?? 1,
      requiredOnly: options.requiredOnly ?? false,
      useDefault: options.useDefault ?? false,
      useExamples: options.useExamples ?? false,
    }
  }

  private generateAllOf(schemas: Schema[]): unknown {
    const merged: Record<string, unknown> = {}

    for (const schema of schemas) {
      const value = this.generateValue(schema)

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(merged, value)
      }
    }

    return merged
  }

  private generateArray(schema: Schema): unknown[] {
    const minItems = schema.minItems ?? 0
    const maxItems = schema.maxItems ?? 3
    const length = Math.max(minItems, Math.min(maxItems, 1))

    if (!schema.items) {
      return Array.from({
        length,
      }).fill(null)
    }

    if (Array.isArray(schema.items)) {
      return schema.items.map((itemSchema) => this.generateValue(itemSchema))
    }

    return Array.from({
      length,
    }).fill(this.generateValue(schema.items as Schema))
  }

  private generateByType(schema: Schema): unknown {
    const type = schema.type || 'object'

    switch (type) {
      case 'null':
        return null

      case 'boolean':
        return false

      case 'integer':
      case 'number':
        return this.generateNumber(schema)

      case 'string':
        return this.generateString(schema)

      case 'array':
        return this.generateArray(schema)

      case 'object':
        return this.generateObject(schema)

      default:
        return null
    }
  }

  private generateNumber(schema: Schema): number {
    let min

    if (schema.minimum !== undefined) {
      min = schema.minimum
    }
    else if (schema.exclusiveMinimum) {
      if (typeof schema.exclusiveMinimum === 'number') {
        min = schema.exclusiveMinimum + 1
      }
      else {
        min = 1
      }
    }
    else {
      min = 0
    }

    let max

    if (schema.maximum !== undefined) {
      max = schema.maximum
    }
    else if (schema.exclusiveMaximum) {
      if (typeof schema.exclusiveMaximum === 'number') {
        max = schema.exclusiveMaximum - 1
      }
      else {
        max = 99
      }
    }
    else {
      max = 100
    }

    let value = min

    if (schema.multipleOf) {
      value = Math.ceil(min / schema.multipleOf) * schema.multipleOf

      if (value > max) {
        value = schema.multipleOf
      }
    }

    return schema.type === 'integer' ? Math.floor(value) : value
  }

  private generateObject(schema: Schema): Record<string, unknown> {
    const obj: Record<string, unknown> = {}

    if (!schema.properties) {
      return obj
    }

    const required = new Set(schema.required || [])

    for (const [
      propName,
      propSchema,
    ] of Object.entries(schema.properties)) {
      const isRequired = required.has(propName)

      if (this.options.requiredOnly && !isRequired) {
        continue
      }

      if (!isRequired && !this.shouldIncludeOptional()) {
        continue
      }

      const value = this.generateValue(propSchema)

      if (this.options.omitNulls && value === null) {
        continue
      }

      obj[propName] = value
    }

    return obj
  }

  private generateString(schema: Schema): string {
    const minLength = schema.minLength ?? 0
    const maxLength = schema.maxLength ?? 10

    if (schema.format) {
      return this.generateStringByFormat(schema.format, minLength, maxLength)
    }

    if (schema.pattern) {
      return this.generateStringForPattern(schema.pattern, minLength, maxLength)
    }

    const length = Math.max(minLength, Math.min(maxLength, 10))

    return 'a'.repeat(length)
  }

  private generateStringByFormat(format: string, minLength: number, maxLength: number): string {
    switch (format) {
      case 'email':
        return 'test@example.com'
      case 'uri':
      case 'url':
        return 'https://example.com'
      case 'uuid':
        return '00000000-0000-0000-0000-000000000000'
      case 'date':
        return '2024-01-01'
      case 'date-time':
        return '2024-01-01T00:00:00Z'
      case 'time':
        return '00:00:00'
      case 'ipv4':
        return '127.0.0.1'
      case 'ipv6':
        return '::1'
      case 'hostname':
        return 'localhost'
      case 'phone':
        return '+1234567890'
      default: {
        const length = Math.max(minLength, Math.min(maxLength, 10))

        return 'string'.substring(0, Math.max(length, 1))
      }
    }
  }

  private generateStringForPattern(pattern: string, minLength: number, maxLength: number): string {
    const length = Math.max(minLength, Math.min(maxLength, 10))

    return 'x'.repeat(length)
  }

  private generateValue(schema: Schema): unknown {
    if (schema.$ref) {
      if (this.seenRefs.has(schema.$ref)) {
        return null
      }

      this.seenRefs.add(schema.$ref)
    }

    if (this.options.useDefault && schema.default !== undefined) {
      return schema.default
    }

    if (this.options.useExamples && schema.examples && schema.examples.length > 0) {
      return schema.examples[0]
    }

    if (schema.const !== undefined) {
      return schema.const
    }

    if (schema.enum && schema.enum.length > 0) {
      return schema.enum[0]
    }

    if (schema.nullable && this.shouldIncludeNull()) {
      return null
    }

    if (schema.allOf && schema.allOf.length > 0) {
      return this.generateAllOf(schema.allOf)
    }

    if (schema.anyOf && schema.anyOf.length > 0) {
      return this.generateValue(schema.anyOf[0])
    }
    if (schema.oneOf && schema.oneOf.length > 0) {
      return this.generateValue(schema.oneOf[0])
    }

    if (Array.isArray(schema.type)) {
      const nonNullTypes = schema.type.filter((t) => t !== 'null')
      const type = nonNullTypes.length > 0 ? nonNullTypes[0] : 'null'

      return this.generateByType({
        ...schema,
        type,
      })
    }

    return this.generateByType(schema)
  }

  private shouldIncludeNull(): boolean {
    return !this.options.omitNulls && Math.random() < 0.1
  }

  private shouldIncludeOptional(): boolean {
    if (this.options.alwaysIncludeOptionals) {
      return true
    }

    if (this.options.optionalsProbability === false) {
      return false
    }

    return Math.random() < this.options.optionalsProbability
  }

  /**
   * Generate mock data from schema
   */
  generate(schema: Schema): unknown {
    this.seenRefs.clear()

    return this.generateValue(schema)
  }
}

/**
 * Generates mock data using custom mock generator
 * @param schema - JSON Schema
 * @param options - Generation options
 * @returns Generated mock data
 */
export function generateMock<T = unknown>(schema: unknown, options?: MockOptions): T {
  const generator = new MockGenerator(options)

  return generator.generate(schema as Schema) as T
}

export type { BuilderOptions } from '../types'
export type { Schema as BuilderSchema } from '../types'
