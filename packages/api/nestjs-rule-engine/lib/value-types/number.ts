import type { BinaryOperator, UnaryOperator } from '#src/operator.js'
import type { DefaultValueTypes, ValueTypeDefinition } from '#src/value-types.js'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDefined, IsNumber, isNumber } from 'class-validator'

type DefaultNumberOperator =
  | BinaryOperator<'number.equals', 'number', 'number'>
  | BinaryOperator<'number.not-equals', 'number', 'number'>
  | BinaryOperator<'number.greater-than', 'number', 'number'>
  | BinaryOperator<'number.greater-than-or-equal', 'number', 'number'>
  | BinaryOperator<'number.less-than', 'number', 'number'>
  | BinaryOperator<'number.less-than-or-equal', 'number', 'number'>
  | BinaryOperator<'number.divisible-by', 'number', 'number'>
  | UnaryOperator<'number.zero', 'number'>
  | UnaryOperator<'number.positive', 'number'>
  | UnaryOperator<'number.negative', 'number'>
  | UnaryOperator<'number.non-positive', 'number'>
  | UnaryOperator<'number.non-negative', 'number'>
  | UnaryOperator<'number.even', 'number'>
  | UnaryOperator<'number.odd', 'number'>

/**
 * Built-in number value type definition.
 */
export const DEFAULT_NUMBER_VALUE_TYPE_DEFINITION: ValueTypeDefinition<
  DefaultValueTypes,
  'number'
> = {
  dtoDecorators: [
    ApiProperty({ type: Number }),
    Type(() => Number),
    IsDefined(),
    IsNumber()
  ],
  transformer: (v: unknown) => {
    if (!isNumber(v)) {
      throw new Error(`expected ${String(v)} to be a number`)
    }

    return v
  }
}

/**
 * Useful built-in number operators.
 */
export const DEFAULT_NUMBER_OPERATORS = [
  {
    id: 'number.equals',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue === rightValue
  },
  {
    id: 'number.not-equals',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue !== rightValue
  },
  {
    id: 'number.greater-than',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue > rightValue
  },
  {
    id: 'number.greater-than-or-equal',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue >= rightValue
  },
  {
    id: 'number.less-than',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue < rightValue
  },
  {
    id: 'number.less-than-or-equal',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue <= rightValue
  },
  {
    id: 'number.divisible-by',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => rightValue !== 0 && leftValue % rightValue === 0
  },
  {
    id: 'number.zero',
    leftValueType: 'number',
    evaluate: (leftValue: number) => leftValue === 0
  },
  {
    id: 'number.positive',
    leftValueType: 'number',
    evaluate: (leftValue: number) => leftValue > 0
  },
  {
    id: 'number.negative',
    leftValueType: 'number',
    evaluate: (leftValue: number) => leftValue < 0
  },
  {
    id: 'number.non-positive',
    leftValueType: 'number',
    evaluate: (leftValue: number) => leftValue <= 0
  },
  {
    id: 'number.non-negative',
    leftValueType: 'number',
    evaluate: (leftValue: number) => leftValue >= 0
  },
  {
    id: 'number.even',
    leftValueType: 'number',
    evaluate: (leftValue: number) => Number.isInteger(leftValue) && leftValue % 2 === 0
  },
  {
    id: 'number.odd',
    leftValueType: 'number',
    evaluate: (leftValue: number) => Number.isInteger(leftValue) && Math.abs(leftValue % 2) === 1
  }
] as const satisfies readonly DefaultNumberOperator[]
