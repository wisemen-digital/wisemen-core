import type {
  ExtendedSchema,
  JsonValue,
  Schema,
  ZodGeneratorOptions,
} from '../types'

const VALID_IDENTIFIER_REGEX = /^[a-z_]\w*$/i

/**
 * Generates a Zod schema string from a JSON schema
 * @param schema - JSON Schema
 * @param options - Generator options
 * @returns Zod schema code
 */
export function generateZodSchema(schema: Schema, options: ZodGeneratorOptions = {}): string {
  return generateZodSchemaInternal(schema as ExtendedSchema, options)
}

function generateZodSchemaInternal(schema: ExtendedSchema, options: ZodGeneratorOptions): string {
  if (!schema || typeof schema !== 'object') {
    return 'z.unknown()'
  }

  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    const enumValues = schema.anyOf
      .filter((item) => item && typeof item === 'object' && 'const' in item)
      .map((item) => (item as { const: JsonValue }).const)

    if (enumValues.length > 0) {
      const zodEnumValues = enumValues.map((val) => JSON.stringify(val)).join(', ')

      return `z.enum([${zodEnumValues}])`
    }
  }

  if (schema.enum && Array.isArray(schema.enum)) {
    const zodEnumValues = schema.enum.map((val) => JSON.stringify(val)).join(', ')

    return `z.enum([${zodEnumValues}])`
  }

  if (Array.isArray(schema.type)) {
    const types = schema.type.filter((t) => t !== 'null')
    const isNullable = schema.type.includes('null')

    if (types.length > 0 && types[0]) {
      let zodType = generateZodForSingleType(types[0], schema, options)

      if (isNullable) {
        zodType += '.nullable()'
      }

      return zodType
    }
    else if (types.length > 1) {
      const unionTypes = types.map((t) => generateZodForSingleType(t, schema, options))
      let zodType = `z.union([${unionTypes.join(', ')}])`

      if (isNullable) {
        zodType += '.nullable()'
      }

      return zodType
    }
  }

  if (typeof schema.type === 'string') {
    return generateZodForSingleType(schema.type, schema, options)
  }

  if (schema.properties && !schema.type) {
    return generateZodObject(schema, options)
  }

  if (schema.items && !schema.type) {
    return generateZodArray(schema, options)
  }

  return 'z.unknown()'
}

function generateZodForSingleType(
  type: string,
  schema: ExtendedSchema,
  options: ZodGeneratorOptions,
): string {
  switch (type) {
    case 'string':
      return generateZodString(schema)
    case 'number':
      return generateZodNumber(schema)
    case 'integer':
      return generateZodInteger(schema)
    case 'boolean':
      return 'z.boolean()'
    case 'null':
      return 'z.null()'
    case 'array':
      return generateZodArray(schema, options)
    case 'object':
      return generateZodObject(schema, options)
    default:
      return 'z.unknown()'
  }
}

function generateZodString(schema: ExtendedSchema): string {
  let zodType = 'z.string()'

  if (schema.format) {
    switch (schema.format) {
      case 'uuid':
        zodType += '.uuid()'

        break
      case 'email':
        zodType += '.email()'

        break
      case 'uri':
      case 'url':
        zodType += '.url()'

        break
      case 'date':
        zodType += '.date()'

        break
      case 'date-time':
        zodType += '.datetime()'

        break
      case 'phone':
        zodType += '.regex(/^\\+?[1-9]\\d{1,14}$/)'

        break
    }
  }

  if (schema.pattern) {
    zodType += `.regex(/${schema.pattern}/)`
  }

  if (typeof schema.minLength === 'number') {
    zodType += `.min(${schema.minLength})`
  }
  if (typeof schema.maxLength === 'number') {
    zodType += `.max(${schema.maxLength})`
  }

  return zodType
}

function generateZodNumber(schema: ExtendedSchema): string {
  let zodType = 'z.number()'

  if (typeof schema.minimum === 'number') {
    zodType += `.min(${schema.minimum})`
  }
  if (typeof schema.maximum === 'number') {
    zodType += `.max(${schema.maximum})`
  }
  if (typeof schema.exclusiveMinimum === 'number') {
    zodType += `.gt(${schema.exclusiveMinimum})`
  }
  if (typeof schema.exclusiveMaximum === 'number') {
    zodType += `.lt(${schema.exclusiveMaximum})`
  }

  return zodType
}

function generateZodInteger(schema: ExtendedSchema): string {
  let zodType = 'z.number().int()'

  if (typeof schema.minimum === 'number') {
    zodType += `.min(${schema.minimum})`
  }
  if (typeof schema.maximum === 'number') {
    zodType += `.max(${schema.maximum})`
  }
  if (typeof schema.exclusiveMinimum === 'number') {
    zodType += `.gt(${schema.exclusiveMinimum})`
  }
  if (typeof schema.exclusiveMaximum === 'number') {
    zodType += `.lt(${schema.exclusiveMaximum})`
  }

  return zodType
}

function generateZodArray(schema: ExtendedSchema, options: ZodGeneratorOptions): string {
  let itemType = 'z.unknown()'

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      const tupleTypes = schema.items.map((item) =>
        generateZodSchemaInternal(item as ExtendedSchema, options))

      return `z.tuple([${tupleTypes.join(', ')}])`
    }
    else {
      itemType = generateZodSchemaInternal(schema.items as ExtendedSchema, options)
    }
  }

  let zodType = `z.array(${itemType})`

  if (typeof schema.minItems === 'number') {
    zodType += `.min(${schema.minItems})`
  }
  if (typeof schema.maxItems === 'number') {
    zodType += `.max(${schema.maxItems})`
  }

  return zodType
}

function generateZodObject(schema: ExtendedSchema, options: ZodGeneratorOptions): string {
  if (!schema.properties) {
    return 'z.object({})'
  }

  const properties: string[] = []
  const required = new Set(schema.required || [])

  for (const [
    key,
    propSchema,
  ] of Object.entries(schema.properties)) {
    const safePropName = VALID_IDENTIFIER_REGEX.test(key) ? key : `"${key}"`
    let propType = generateZodSchemaInternal(propSchema as ExtendedSchema, options)

    if (!required.has(key)) {
      propType += '.optional()'
    }

    properties.push(`${safePropName}: ${propType}`)
  }

  let zodType = `z.object({\n  ${properties.join(',\n  ')}\n})`

  if (schema.additionalProperties === false) {
    zodType += '.strict()'
  }
  else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    const additionalType = generateZodSchemaInternal(
      schema.additionalProperties as ExtendedSchema,
      options,
    )

    zodType += `.catchall(${additionalType})`
  }

  return zodType
}
