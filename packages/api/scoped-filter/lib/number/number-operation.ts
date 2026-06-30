import { ApiPropertyOptions, ApiProperty } from "@nestjs/swagger"

export enum NumberOperation {
    EQUALS = "=",
    NOT_EQUALS = "!=",
    MORE_THAN = ">",
    LESS_THAN = "<",
    MORE_THAN_OR_EQUAL = ">=",
    LESS_THAN_OR_EQUAL = "<=",
}

export function NumberOperationApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: NumberOperation,
    enumName: 'NumberOperation'
  })
}
