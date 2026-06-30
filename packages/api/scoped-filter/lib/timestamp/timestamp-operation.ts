import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum TimestampRangeOperation {
  CONTAINED_IN = '<@',
  NOT_CONTAINED_IN = '!<@'
}

export enum TimestampSingleOperation {
  IS = '=',
  IS_NOT = '!=',
  BEFORE = '<',
  SAME_OR_BEFORE = '<=',
  AFTER = '>',
  SAME_OR_AFTER = '>='
}

export const TimestampOperation = {
  ...TimestampRangeOperation,
  ...TimestampSingleOperation
} as const
export type TimestampOperation = typeof TimestampOperation

export function TimestampOperationApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: TimestampOperation,
    enumName: 'TimestampOperation'
  })
}
