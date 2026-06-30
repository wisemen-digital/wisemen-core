import { ApiPropertyOptions, ApiProperty } from "@nestjs/swagger"

export enum MultiSelectOperation {
    INCLUDE = "include",
    EXCLUDE = "exclude"
}

export function MultiSelectOperationApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: MultiSelectOperation,
    enumName: 'MultiSelectOperation'
  })
}
