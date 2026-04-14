import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { DistanceDto } from './distance.dto.js'
import { DistanceUnit } from './distance-unit.enum.js'
import { Distance } from './distance.js'

export function IsDistance (
  options?: IsQuantityOptions<DistanceUnit, Distance>
): PropertyDecorator {
  return applyDecorators(IsQuantity(DistanceDto, options))
}
