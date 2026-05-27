import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ScopedUuidFilter } from '#src/scoped-uuid-filter.js'

export interface IsScopedUuidFilterValidationOptions {
  each?: boolean
}

/**
 * Validates a ScopedUuidFilter property.
 * Applies \
 * ```
 * @Type(() => ScopedUuidFilter)
 * @ValidateNested({ each: options?.each })
 *  @IsObject()
 * ```
 * 
 * @param options Optional validation options
 * 
 * @example @IsScopedUuidFilter()
 */
export function IsScopedUuidFilter (
  options?: IsScopedUuidFilterValidationOptions
): PropertyDecorator {
  return applyDecorators(
    Type(() => ScopedUuidFilter),
    ValidateNested({ each: options?.each }),
    IsObject()
  )
}
