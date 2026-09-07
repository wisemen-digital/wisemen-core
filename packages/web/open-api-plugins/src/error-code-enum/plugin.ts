import type { IR } from '@hey-api/openapi-ts'
import { $ } from '@hey-api/openapi-ts'

import type { ErrorCodeEnumPlugin } from './types'

const ERROR_STATUS_CODE_REGEX = /^[45]/
const NON_IDENTIFIER_CHARACTER_REGEX = /[^A-Z0-9_$]/g

function getStringConstants(schema: IR.SchemaObject | undefined): string[] {
  if (typeof schema?.const === 'string') {
    return [
      schema.const,
    ]
  }

  return schema?.items?.flatMap(getStringConstants) ?? []
}

function toEnumMemberName(value: string): string {
  const identifier = value.toUpperCase().replace(NON_IDENTIFIER_CHARACTER_REGEX, '_')

  return /^\d/.test(identifier) ? `_${identifier}` : identifier
}

export function getBackendErrorCodes(schemas: Iterable<IR.SchemaObject>): string[] {
  const errorCodeValues = new Set<string>()

  for (const schema of schemas) {
    const statuses = getStringConstants(schema.properties?.status)

    if (!statuses.some((status) => ERROR_STATUS_CODE_REGEX.test(status))) {
      continue
    }

    for (const code of getStringConstants(schema.properties?.code)) {
      errorCodeValues.add(code)
    }
  }

  return [
    ...errorCodeValues,
  ].sort()
}

// eslint-disable-next-line func-style
export const handler: ErrorCodeEnumPlugin['Handler'] = ({
  plugin,
}) => {
  const schemas: IR.SchemaObject[] = []

  plugin.forEach('schema', ({
    schema,
  }) => {
    schemas.push(schema)
  })

  const errorCodeValues = getBackendErrorCodes(schemas)
  const apiErrorCodeSymbol = plugin.symbol('ApiErrorCode')

  plugin.node($.enum(apiErrorCodeSymbol, (enumNode) => {
    for (const value of errorCodeValues) {
      enumNode.member(toEnumMemberName(value), $.literal(value))
    }
  }).export())
}
