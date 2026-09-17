type Schema = Record<string, unknown>

function isSchema (value: unknown): value is Schema {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeSchema (value: unknown): unknown {
  if (!isSchema(value)) {
    return value
  }

  const { nullable, ...schema } = value

  for (const keyword of ['properties', 'patternProperties', 'definitions', '$defs', 'dependentSchemas']) {
    const entries = schema[keyword]

    if (isSchema(entries)) {
      schema[keyword] = Object.fromEntries(
        Object.entries(entries).map(([name, child]) => [name, normalizeSchema(child)])
      )
    }
  }

  for (const keyword of [
    'items', 'additionalItems', 'additionalProperties', 'contains', 'propertyNames',
    'not', 'if', 'then', 'else', 'allOf', 'anyOf', 'oneOf'
  ]) {
    if (keyword in schema) {
      const child = schema[keyword]
      schema[keyword] = Array.isArray(child) ? child.map(normalizeSchema) : normalizeSchema(child)
    }
  }

  if (isSchema(schema.dependencies)) {
    schema.dependencies = Object.fromEntries(Object.entries(schema.dependencies).map(([name, child]) => [
      name, Array.isArray(child) ? child : normalizeSchema(child)
    ]))
  }

  if (nullable !== true) {
    return schema
  }

  const hasConstraints = ['enum', 'const', '$ref', 'allOf', 'anyOf', 'oneOf', 'not', 'if']
    .some(keyword => keyword in schema)

  if (!hasConstraints && (typeof schema.type === 'string' || Array.isArray(schema.type))) {
    const types: unknown[] = Array.isArray(schema.type) ? schema.type : [schema.type]
    schema.type = [...new Set([...types, 'null'])]

    return schema
  }

  const annotations: Schema = {}

  for (const keyword of ['title', 'description', 'default', 'example', 'examples', 'readOnly', 'writeOnly', 'deprecated']) {
    if (keyword in schema) {
      annotations[keyword] = schema[keyword]
      delete schema[keyword]
    }
  }

  return { ...annotations, anyOf: [schema, { type: 'null' }] }
}
