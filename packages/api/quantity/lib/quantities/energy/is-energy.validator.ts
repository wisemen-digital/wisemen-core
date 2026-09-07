import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { EnergyDto } from './energy.dto.js'
import { Energy } from './energy.js'

export function IsEnergy (
  options?: IsQuantityOptions<Energy>
): PropertyDecorator {
  return applyDecorators(IsQuantity(EnergyDto, options))
}
