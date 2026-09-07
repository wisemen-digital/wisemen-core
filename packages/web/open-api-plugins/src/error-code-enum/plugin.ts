import type { IR } from '@hey-api/openapi-ts'
import * as ts from 'typescript'

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
  const file = plugin.createFile({
    id: plugin.name,
    path: plugin.output,
  })
  const schemas: IR.SchemaObject[] = []

  plugin.forEach('schema', ({
    schema,
  }) => {
    schemas.push(schema)
  })

  const errorCodeValues = getBackendErrorCodes(schemas)

  const errorCodeConstNode = ts.factory.createVariableStatement(
    [
      ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
    ],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier('apiErrorCode'),
          undefined,
          undefined,
          ts.factory.createAsExpression(
            ts.factory.createObjectLiteralExpression(
              errorCodeValues.map((value) => {
                return ts.factory.createPropertyAssignment(
                  ts.factory.createIdentifier(toEnumMemberName(value)),
                  ts.factory.createStringLiteral(value),
                )
              }),
              true,
            ),
            ts.factory.createTypeReferenceNode('const'),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )

  const errorCodeEnumNode = ts.factory.createEnumDeclaration(
    [
      ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
    ],
    ts.factory.createIdentifier('ApiErrorCode'),
    errorCodeValues.map((value) => {
      return ts.factory.createEnumMember(
        ts.factory.createIdentifier(toEnumMemberName(value)),
        ts.factory.createStringLiteral(value),
      )
    }),
  )

  file.add(errorCodeEnumNode)
  file.add(errorCodeConstNode)
  file.add('export type ApiErrorCodeType = (typeof apiErrorCode)[keyof typeof apiErrorCode];')
}
