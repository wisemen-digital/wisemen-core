import type { BinaryOperator, UnaryOperator } from '#src/operator.js'
import type { DefaultValueTypes, ValueTypeDefinition } from '#src/value-types.js'
import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsString, isString } from 'class-validator'

type DefaultStringOperator =
  | BinaryOperator<'string.equals', 'string', 'string'>
  | BinaryOperator<'string.not-equals', 'string', 'string'>
  | BinaryOperator<'string.equals-ignore-case', 'string', 'string'>
  | BinaryOperator<'string.contains', 'string', 'string'>
  | BinaryOperator<'string.not-contains', 'string', 'string'>
  | BinaryOperator<'string.contains-ignore-case', 'string', 'string'>
  | BinaryOperator<'string.starts-with', 'string', 'string'>
  | BinaryOperator<'string.starts-with-ignore-case', 'string', 'string'>
  | BinaryOperator<'string.ends-with', 'string', 'string'>
  | BinaryOperator<'string.ends-with-ignore-case', 'string', 'string'>
  | UnaryOperator<'string.empty', 'string'>
  | UnaryOperator<'string.not-empty', 'string'>
  | UnaryOperator<'string.blank', 'string'>
  | UnaryOperator<'string.not-blank', 'string'>
  | BinaryOperator<'string.length.equals', 'string', 'number'>
  | BinaryOperator<'string.length.greater-than', 'string', 'number'>
  | BinaryOperator<'string.length.greater-than-or-equal', 'string', 'number'>
  | BinaryOperator<'string.length.less-than', 'string', 'number'>
  | BinaryOperator<'string.length.less-than-or-equal', 'string', 'number'>

function normalizeCase (value: string): string {
  return value.toLowerCase()
}

/**
 * Built-in string value type definition.
 */
export const DEFAULT_STRING_VALUE_TYPE_DEFINITION: ValueTypeDefinition<
  DefaultValueTypes,
  'string'
> = {
  dtoDecorators: [
    ApiProperty({ type: String }),
    IsDefined(),
    IsString()
  ],
  transformer: (v: unknown) => {
    if (!isString(v)) {
      throw new Error(`expected ${String(v)} to be a string`)
    }

    return v
  }
}

/**
 * Useful built-in string operators.
 */
export const DEFAULT_STRING_OPERATORS = [
  {
    id: 'string.equals',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue === rightValue
  },
  {
    id: 'string.not-equals',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue !== rightValue
  },
  {
    id: 'string.equals-ignore-case',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => normalizeCase(leftValue) === normalizeCase(rightValue)
  },
  {
    id: 'string.contains',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue.includes(rightValue)
  },
  {
    id: 'string.not-contains',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => !leftValue.includes(rightValue)
  },
  {
    id: 'string.contains-ignore-case',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => normalizeCase(leftValue).includes(normalizeCase(rightValue))
  },
  {
    id: 'string.starts-with',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue.startsWith(rightValue)
  },
  {
    id: 'string.starts-with-ignore-case',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => normalizeCase(leftValue).startsWith(normalizeCase(rightValue))
  },
  {
    id: 'string.ends-with',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue.endsWith(rightValue)
  },
  {
    id: 'string.ends-with-ignore-case',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => normalizeCase(leftValue).endsWith(normalizeCase(rightValue))
  },
  {
    id: 'string.empty',
    leftValueType: 'string',
    evaluate: (leftValue: string) => leftValue.length === 0
  },
  {
    id: 'string.not-empty',
    leftValueType: 'string',
    evaluate: (leftValue: string) => leftValue.length > 0
  },
  {
    id: 'string.blank',
    leftValueType: 'string',
    evaluate: (leftValue: string) => leftValue.trim().length === 0
  },
  {
    id: 'string.not-blank',
    leftValueType: 'string',
    evaluate: (leftValue: string) => leftValue.trim().length > 0
  },
  {
    id: 'string.length.equals',
    leftValueType: 'string',
    rightValueType: 'number',
    evaluate: (leftValue: string, rightValue: number) => leftValue.length === rightValue
  },
  {
    id: 'string.length.greater-than',
    leftValueType: 'string',
    rightValueType: 'number',
    evaluate: (leftValue: string, rightValue: number) => leftValue.length > rightValue
  },
  {
    id: 'string.length.greater-than-or-equal',
    leftValueType: 'string',
    rightValueType: 'number',
    evaluate: (leftValue: string, rightValue: number) => leftValue.length >= rightValue
  },
  {
    id: 'string.length.less-than',
    leftValueType: 'string',
    rightValueType: 'number',
    evaluate: (leftValue: string, rightValue: number) => leftValue.length < rightValue
  },
  {
    id: 'string.length.less-than-or-equal',
    leftValueType: 'string',
    rightValueType: 'number',
    evaluate: (leftValue: string, rightValue: number) => leftValue.length <= rightValue
  }
] as const satisfies readonly DefaultStringOperator[]
