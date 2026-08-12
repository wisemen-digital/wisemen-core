import type { BinaryOperator, UnaryOperator } from '#src/operator.js'
import type { DefaultValueTypes, ValueTypeDefinition } from '#src/value-types.js'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsDefined, isBoolean } from 'class-validator'

type DefaultBooleanOperator =
  | UnaryOperator<'boolean.truthy', 'boolean'>
  | UnaryOperator<'boolean.falsy', 'boolean'>
  | BinaryOperator<'boolean.equals', 'boolean', 'boolean'>
  | BinaryOperator<'boolean.not-equals', 'boolean', 'boolean'>

/**
 * Normalizes boolean DTO input values from string query/body payloads.
 */
export function transformBooleanDtoValue (value: unknown): unknown {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return value
}

/**
 * Built-in boolean value type definition.
 */
export const DEFAULT_BOOLEAN_VALUE_TYPE_DEFINITION: ValueTypeDefinition<
  DefaultValueTypes,
  'boolean'
> = {
  dtoDecorators: [
    ApiProperty({ type: Boolean }),
    Transform(({ value }) => transformBooleanDtoValue(value as unknown), { toClassOnly: true }),
    IsDefined(),
    IsBoolean()
  ],
  transformer: (v: unknown) => {
    if (!isBoolean(v)) {
      throw new Error(`expected ${String(v)} to be a boolean`)
    }

    return v
  }
}

/**
 * Useful built-in boolean operators.
 */
export const DEFAULT_BOOLEAN_OPERATORS = [
  {
    id: 'boolean.truthy',
    leftValueType: 'boolean',
    evaluate: (leftValue: boolean) => leftValue
  },
  {
    id: 'boolean.falsy',
    leftValueType: 'boolean',
    evaluate: (leftValue: boolean) => !leftValue
  },
  {
    id: 'boolean.equals',
    leftValueType: 'boolean',
    rightValueType: 'boolean',
    evaluate: (leftValue: boolean, rightValue: boolean) => leftValue === rightValue
  },
  {
    id: 'boolean.not-equals',
    leftValueType: 'boolean',
    rightValueType: 'boolean',
    evaluate: (leftValue: boolean, rightValue: boolean) => leftValue !== rightValue
  }
] as const satisfies readonly DefaultBooleanOperator[]
