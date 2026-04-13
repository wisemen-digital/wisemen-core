import type {
  DefinePlugin,
  IR,
} from '@hey-api/openapi-ts'

/**
 * JSON Schema definition
 */
export interface Schema {
  title?: string
  $id?: string
  $ref?: string
  $schema?: string
  [key: string]: unknown
  additionalProperties?: boolean | Schema
  allOf?: Schema[]
  anyOf?: Schema[]
  const?: JsonValue
  default?: unknown
  description?: string
  enum?: JsonValue[]
  examples?: unknown[]
  exclusiveMaximum?: boolean | number
  exclusiveMinimum?: boolean | number
  format?: string
  items?: Schema | Schema[]
  maximum?: number
  maxItems?: number
  maxLength?: number
  maxProperties?: number
  minimum?: number
  minItems?: number
  minLength?: number
  minProperties?: number
  multipleOf?: number
  nullable?: boolean
  pattern?: string
  properties?: Record<string, Schema>
  required?: string[]
  type?:
    | 'array'
    | 'boolean'
    | 'integer'
    | 'null'
    | 'number'
    | 'object'
    | 'string'
    | Array<'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'>
  uniqueItems?: boolean
  oneOf?: Schema[]
}

/**
 * Mock generation strategy
 */
export type MockStrategy = 'runtime' | 'static' | 'zod'

/**
 * Plugin configuration options
 */
export interface Config {
  /**
   * Plugin name. Must be unique.
   */
  name: 'builders'
  /**
   * Generate Zod schemas alongside builders for validation
   *
   * @default false
   */
  generateZod?: boolean
  /**
   * Strategy for generating mock data in builders
   * - 'runtime': Use custom lightweight runtime mock generation (default)
   * - 'zod': Use Zod schemas for mock generation
   * - 'static': Generate hardcoded static mock values
   *
   * @default 'runtime'
   */
  mockStrategy?: MockStrategy
  /**
   * User-configurable option for your plugin.
   *
   * @default false
   */
  myOption?: boolean
  /**
   * Name of the generated file.
   *
   * @default 'builders'
   */
  output?: string
}

/**
 * Builder plugin type
 */
export type BuildersPlugin = DefinePlugin<Config>

/**
 * Builder handler type
 */
export type BuildersHandler = BuildersPlugin['Handler']

/**
 * Options for builder instances
 */
export interface BuilderOptions {
  alwaysIncludeOptionals?: boolean
  omitNulls?: boolean
  optionalsProbability?: number | false
  useDefault?: boolean
  useExamples?: boolean
}

/**
 * JSON value types
 */
export type JsonValue
  = | boolean
    | number
    | string
    | JsonValue[]
    | { [key: string]: JsonValue }
    | null

/**
 * Schema metadata for code generation
 */
export interface GeneratedSchemaMeta {
  isEnum: boolean
  isObject: boolean
  constName: string
  schema: Schema
  typeName: string
}

/**
 * Enum item in OpenAPI schema
 */
export interface EnumItem {
  const: JsonValue
  description?: string
}

/**
 * Extended schema object supporting enum structures
 */
export interface EnumSchemaObject {
  $ref?: string
  [key: string]: unknown
  additionalProperties?: boolean | IR.SchemaObject
  allOf?: IR.SchemaObject[]
  anyOf?: IR.SchemaObject[]
  enum?: JsonValue[]
  items?: EnumItem[] | IR.SchemaObject | IR.SchemaObject[]
  nullable?: boolean
  properties?: Record<string, IR.SchemaObject>
  required?: string[]
  type?: string | 'enum'
  oneOf?: IR.SchemaObject[]
}

/**
 * Extended JSON schema with additional properties
 */
export interface ExtendedSchema {
  [key: string]: unknown
  additionalProperties?: boolean | Schema
  allOf?: Schema[]
  anyOf?: Schema[]
  default?: unknown
  enum?: JsonValue[]
  examples?: unknown[]
  exclusiveMaximum?: number
  exclusiveMinimum?: number
  format?: string
  items?: Schema | Schema[]
  maximum?: number
  maxItems?: number
  maxLength?: number
  minimum?: number
  minItems?: number
  minLength?: number
  nullable?: boolean
  pattern?: string
  properties?: Record<string, Schema>
  required?: string[]
  type?:
    | 'array'
    | 'boolean'
    | 'integer'
    | 'null'
    | 'number'
    | 'object'
    | 'string'
    | Array<'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'>
  oneOf?: Schema[]
}

/**
 * Normalized schema node for internal processing
 */
export interface NormalizedSchemaNode {
  [key: string]: unknown
  additionalProperties?: boolean | NormalizedSchemaNode
  allOf?: NormalizedSchemaNode[]
  anyOf?: NormalizedSchemaNode[]
  const?: JsonValue
  enum?: JsonValue[]
  items?: NormalizedSchemaNode | NormalizedSchemaNode[]
  logicalOperator?: string
  properties?: Record<string, NormalizedSchemaNode>
  type?:
    | 'array'
    | 'boolean'
    | 'enum'
    | 'integer'
    | 'null'
    | 'number'
    | 'object'
    | 'string'
    | Array<'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string'>
  oneOf?: NormalizedSchemaNode[]
}

/**
 * Options for Zod mock generation
 */
export interface ZodMockOptions {
  alwaysIncludeOptionals?: boolean
  omitNulls?: boolean
  optionalsProbability?: number | false
  useDefault?: boolean
  useExamples?: boolean
}

/**
 * Options for Zod schema generation
 */
export interface ZodGeneratorOptions {
  useNullable?: boolean
  useOptional?: boolean
}
