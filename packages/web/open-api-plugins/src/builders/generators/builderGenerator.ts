import { generateWithMethods } from '../core/codeGenerator'
import type {
  GeneratedSchemaMeta,
  MockStrategy,
  Schema,
} from '../types'
import { generateStaticMockCode } from './staticMockGenerator'
import { generateZodSchema } from './zodSchemaGenerator'

/**
 * Builder class generation
 */

export interface BuilderGeneratorOptions {
  mockStrategy: MockStrategy
}

/**
 * Generates a builder class for an enum schema
 */
export function generateEnumBuilder(
  meta: GeneratedSchemaMeta,
  options: BuilderGeneratorOptions,
): string {
  const {
    constName,
    schema,
    typeName,
  } = meta
  const {
    mockStrategy,
  } = options

  let code = `export class ${typeName}Builder {\n`

  code += `  private options: BuilderOptions = {}\n`
  code += `  setOptions(o: BuilderOptions): this { this.options = o || {}; return this }\n\n`

  if (mockStrategy === 'static') {
    code += generateStaticEnumBuild(typeName, schema)
  }
  else if (mockStrategy === 'zod') {
    code += generateZodEnumBuild(typeName, schema)
  }
  else {
    code += generateCustomEnumBuild(typeName, constName)
  }

  code += `}\n\n`

  return code
}

/**
 * Generates a builder class for an object schema
 */
export function generateObjectBuilder(
  meta: GeneratedSchemaMeta,
  options: BuilderGeneratorOptions,
): string {
  const {
    constName,
    schema,
    typeName,
  } = meta
  const {
    mockStrategy,
  } = options

  let code = `export class ${typeName}Builder {\n`

  code += `  private overrides: Partial<types.${typeName}> = {}\n`
  code += `  private options: BuilderOptions = {}\n`
  code += `  setOptions(o: BuilderOptions): this { this.options = o || {}; return this }\n`

  const withMethods = generateWithMethods(schema, typeName)

  if (withMethods) {
    code += `${withMethods}\n`
  }

  code += '\n'

  if (mockStrategy === 'static') {
    code += generateStaticObjectBuild(typeName, schema)
  }
  else if (mockStrategy === 'zod') {
    code += generateZodObjectBuild(typeName, schema)
  }
  else {
    code += generateCustomObjectBuild(typeName, constName)
  }

  code += `}\n\n`

  return code
}

/**
 * Static mock build method for enums
 */
function generateStaticEnumBuild(typeName: string, schema: Schema): string {
  const staticMock = generateStaticMockCode(schema, typeName)

  return `  build(): types.${typeName} {\n    return ${staticMock} as types.${typeName};\n  }\n`
}

/**
 * Zod mock build method for enums
 */
function generateZodEnumBuild(typeName: string, schema: Schema): string {
  const zodSchemaString = generateZodSchema(schema)

  return (
    `  build(): types.${typeName} {\n`
    + `    const zodSchemaString = \`${zodSchemaString}\`;\n`
    + `    return generateMockFromZodSchema(zodSchemaString, {}, {\n`
    + `      useDefault: this.options.useDefault,\n`
    + `      useExamples: this.options.useExamples,\n`
    + `      alwaysIncludeOptionals: this.options.alwaysIncludeOptionals,\n`
    + `      optionalsProbability: this.options.optionalsProbability,\n`
    + `      omitNulls: this.options.omitNulls\n`
    + `    }) as types.${typeName};\n`
    + `  }\n`
  )
}

/**
 * Custom runtime build method for enums
 */
function generateCustomEnumBuild(typeName: string, constName: string): string {
  return (
    `  build(): types.${typeName} {\n`
    + `    return generateMock<types.${typeName}>(schemas.${constName}, {\n`
    + `      useDefault: this.options.useDefault,\n`
    + `      useExamples: this.options.useExamples,\n`
    + `      alwaysIncludeOptionals: this.options.alwaysIncludeOptionals,\n`
    + `      optionalsProbability: this.options.optionalsProbability,\n`
    + `      omitNulls: this.options.omitNulls\n`
    + `    })\n`
    + `  }\n`
  )
}

/**
 * Static mock build method for objects
 */
function generateStaticObjectBuild(typeName: string, schema: Schema): string {
  const staticMock = generateStaticMockCode(schema, typeName)

  return (
    `  build(): types.${typeName} {\n`
    + `    const baseMock = ${staticMock};\n`
    + `    return { ...baseMock, ...this.overrides } as types.${typeName};\n`
    + `  }\n`
  )
}

/**
 * Zod mock build method for objects
 */
function generateZodObjectBuild(typeName: string, schema: Schema): string {
  const zodSchemaString = generateZodSchema(schema)

  return (
    `  build(): types.${typeName} {\n`
    + `    const zodSchemaString = \`${zodSchemaString}\`;\n`
    + `    return generateMockFromZodSchema(zodSchemaString, this.overrides, {\n`
    + `      useDefault: this.options.useDefault,\n`
    + `      useExamples: this.options.useExamples,\n`
    + `      alwaysIncludeOptionals: this.options.alwaysIncludeOptionals,\n`
    + `      optionalsProbability: this.options.optionalsProbability,\n`
    + `      omitNulls: this.options.omitNulls\n`
    + `    }) as types.${typeName};\n`
    + `  }\n`
  )
}

/**
 * Custom runtime build method for objects
 */
function generateCustomObjectBuild(typeName: string, constName: string): string {
  return (
    `  build(): types.${typeName} {\n`
    + `    const mock = generateMock<types.${typeName}>(schemas.${constName}, {\n`
    + `      useDefault: this.options.useDefault,\n`
    + `      useExamples: this.options.useExamples,\n`
    + `      alwaysIncludeOptionals: this.options.alwaysIncludeOptionals,\n`
    + `      optionalsProbability: this.options.optionalsProbability,\n`
    + `      omitNulls: this.options.omitNulls\n`
    + `    })\n`
    + `    for (const k in this.overrides) {\n`
    + `      if (Object.prototype.hasOwnProperty.call(this.overrides, k)) {\n`
    + `        const typedMock = mock as Record<string, unknown>;\n`
    + `        const typedOverrides = this.overrides as Record<string, unknown>;\n`
    + `        typedMock[k] = typedOverrides[k];\n`
    + `      }\n`
    + `    }\n`
    + `    return mock\n`
    + `  }\n`
  )
}
