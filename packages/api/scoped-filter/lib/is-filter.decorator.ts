import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsObject, ValidateNested } from 'class-validator'

export interface IsFilterValidationOptions {
  each?: boolean
}

type ClassLike = new (...args: unknown[]) => object

export function IsFilter (
  filterType: ClassLike,
  options?: IsFilterValidationOptions
): PropertyDecorator {
  return applyDecorators(
    Type(() => filterType),
    ValidateNested({ each: options?.each }),
    IsObject()
  )
}
