import * as ts from 'typescript'

import type { ErrorCodeEnumPlugin } from './types'

const ERROR_STATUS_CODE_REGEX = /^[45]/
const HYPHEN_REGEX = /-/g

// eslint-disable-next-line func-style
export const handler: ErrorCodeEnumPlugin['Handler'] = ({
  plugin,
}) => {
  const file = plugin.createFile({
    id: plugin.name,
    path: plugin.output,
  })
  const errorCodeValues: string[] = []

  // eslint-disable-next-line unicorn/no-array-for-each
  plugin.forEach('schema', ({
    schema,
  }) => {
    const errorStatus = schema?.properties?.status?.items?.[0]?.const as string

    if (errorStatus && ERROR_STATUS_CODE_REGEX.test(errorStatus)) {
      errorCodeValues.push(
        schema?.properties?.code?.items?.[0]?.const as string ?? 'unknown',
      )
    }
  })

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
                  ts.factory.createIdentifier(value.toUpperCase().replace(HYPHEN_REGEX, '_')),
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
        ts.factory.createIdentifier(value.toUpperCase().replace(HYPHEN_REGEX, '_')),
        ts.factory.createStringLiteral(value),
      )
    }),
  )

  file.add(errorCodeEnumNode)
  file.add(errorCodeConstNode)
  file.add(`export type ApiErrorCodeType = typeof apiErrorCode;`)
}
