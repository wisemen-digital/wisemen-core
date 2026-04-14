import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { EnergyDto } from './energy.dto.js'
import { EnergyUnit } from './energy-unit.enum.js'
import { Energy } from './energy.js'

export function IsEnergy (
  options?: IsQuantityOptions<EnergyUnit, Energy>
): PropertyDecorator {
  return applyDecorators(IsQuantity(EnergyDto, options))
}
