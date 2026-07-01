import { ApiPropertyOptions, ApiProperty } from "@nestjs/swagger"

export enum PlainDateRangeOperation {
  CONTAINED_IN = '<@',
  NOT_CONTAINED_IN = '!<@'
}

export enum PlainDateSingleOperation {
    IS = "=",
    IS_NOT = "!=",
    BEFORE = "<",
    SAME_OR_BEFORE = "<=",
    AFTER = ">",
    SAME_OR_AFTER = ">=",
}

export const PlainDateOperation = {
  ...PlainDateRangeOperation,
  ...PlainDateSingleOperation
} as const 
export type PlainDateOperation = typeof PlainDateOperation

export function PlainDateOperationApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: PlainDateOperation,
    enumName: 'PlainDateOperation'
  })
}
