import type { IR } from '@hey-api/openapi-ts'

import {
  generateBuilderOptionsType,
  generateImports,
  generateSchemaConstants,
} from '../core/codeGenerator'
import { collectSchemas } from '../core/schemaTransformer'
import {
  generateEnumBuilder,
  generateObjectBuilder,
} from '../generators/builderGenerator'
import { generateZodSchema } from '../generators/zodSchemaGenerator'
import type { MockStrategy } from '../types'

/**
 * Resolves the mock strategy from config
 */
function resolveMockStrategy(config: {
  mockStrategy?: MockStrategy
}): MockStrategy {
  // Return the configured strategy or default to 'runtime'
  return config.mockStrategy || 'runtime'
}

/**
 * Main plugin handler for generating builder classes
 */
export function handler({
  plugin,
}): void {
  const rawSchemas: Record<string, IR.SchemaObject> = {}

  // eslint-disable-next-line unicorn/no-array-for-each
  plugin.forEach('schema', (event) => {
    rawSchemas[event.name] = event.schema
  })

  const metas = collectSchemas(rawSchemas)

  const file = plugin.createFile({
    id: plugin.name,
    path: plugin.output,
  })

  const config = plugin.config
  const generateZod = config.generateZod || false
  const mockStrategy = resolveMockStrategy(config)

  let out = ''

  out += generateImports({
    generateZod,
    mockStrategy,
  })

  out += generateBuilderOptionsType()

  if (mockStrategy === 'runtime') {
    out += generateSchemaConstants(metas)
  }

  if (generateZod || mockStrategy === 'zod') {
    const zodSchemaEntries: string[] = []

    for (const m of metas) {
      const zodSchemaString = generateZodSchema(m.schema)

      zodSchemaEntries.push(`  ${m.constName}Zod: ${zodSchemaString}`)
    }

    out += `export const zodSchemas = {\n${zodSchemaEntries.join(',\n')}\n}\n\n`
  }

  for (const m of metas) {
    if (m.isEnum) {
      out += generateEnumBuilder(m, {
        mockStrategy,
      })
    }
    else {
      out += generateObjectBuilder(m, {
        mockStrategy,
      })
    }
  }

  file.add(out)
}
