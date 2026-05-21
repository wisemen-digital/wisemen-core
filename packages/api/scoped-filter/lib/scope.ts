import { ApiPropertyOptions, ApiProperty } from "@nestjs/swagger"

export enum Scope {
    INCLUDE = "include",
    EXCLUDE = "exclude"
}

export function FilterScopeApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: Scope,
    enumName: 'FilterScopeApiProperty'
  })
}
