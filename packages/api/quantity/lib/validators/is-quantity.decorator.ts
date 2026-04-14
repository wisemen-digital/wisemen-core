import { ClassConstructor, Type } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, ValidationOptions } from 'class-validator'
import { Quantity } from '../quantity.js'
import { QuantityDto } from '../quantity.dto.js'
import { MinQuantityValidator } from './min-quantity.validator.js'
import { MaxQuantityValidator } from './max-quantity.validator.js'

export interface IsQuantityOptions<U extends string, Q extends Quantity<U, Q>>
  extends ValidationOptions {
  min?: Q
  max?: Q
}

export function IsQuantity<U extends string, Q extends Quantity<U, Q>> (
  quantityClass: ClassConstructor<QuantityDto<Q>>,
  options?: IsQuantityOptions<U, Q>
): PropertyDecorator {
  const decorators = [
    Type(() => quantityClass),
    ValidateNested(options),
    IsObject(options)
  ]

  if (options?.min !== undefined) {
    const validator = new MinQuantityValidator(options.min)

    decorators.push(ValidateBy({ name: 'minQuantityValidator', validator }))
  }

  if (options?.max !== undefined) {
    const validator = new MaxQuantityValidator(options.max)

    decorators.push(ValidateBy({ name: 'maxQuantityValidator', validator }))
  }

  return applyDecorators(...decorators)
}
