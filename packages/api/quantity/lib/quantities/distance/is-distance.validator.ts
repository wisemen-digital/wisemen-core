import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { DistanceDto } from './distance.dto.js'
import { Distance } from './distance.js'

export function IsDistance (
  options?: IsQuantityOptions<Distance>
): PropertyDecorator {
  return applyDecorators(IsQuantity(DistanceDto, options))
}
