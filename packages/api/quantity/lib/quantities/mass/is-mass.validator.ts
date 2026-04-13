import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { MassDto } from './mass.dto.js'
import { MassUnit } from './mass-unit.enum.js'
import { Mass } from './mass.js'

export function IsMass (
  options?: IsQuantityOptions<MassUnit, Mass>
): PropertyDecorator {
  return applyDecorators(IsQuantity(MassDto, options))
}
