import { ClassConstructor, Type } from 'class-transformer'
import { applyDecorators } from '@nestjs/common'
import { IsObject, ValidateBy, ValidateNested, ValidationOptions } from 'class-validator'
import { Comparable, Quantity } from '#lib/quantity.js'
import { QuantityDto } from '#lib/quantity.dto.js'
import { MinQuantityValidator } from './min-quantity.validator.js'
import { MaxQuantityValidator } from './max-quantity.validator.js'

export interface IsQuantityOptions<Q extends Quantity & Comparable>
  extends ValidationOptions {
  min?: Q
  max?: Q
}

export function IsQuantity<Q extends Quantity & Comparable> (
  quantityClass: ClassConstructor<QuantityDto<Q>>,
  options?: IsQuantityOptions<Q>
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
