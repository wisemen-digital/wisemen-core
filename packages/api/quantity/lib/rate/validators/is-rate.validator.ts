import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsObject, ValidateNested, ValidationOptions } from 'class-validator'
import { RateDto } from '#lib/rate/rate.dto.js'

export function IsRate (
  options?: ValidationOptions
): PropertyDecorator {
  const decorators = [
    Type(() => RateDto),
    ValidateNested(options),
    IsObject(options)
  ]

  return applyDecorators(...decorators)
}
