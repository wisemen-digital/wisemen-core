import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { PowerDto } from './power.dto.js'
import { PowerUnit } from './power-unit.enum.js'
import { Power } from './power.js'

export function IsPower (
  options?: IsQuantityOptions<PowerUnit, Power>
): PropertyDecorator {
  return applyDecorators(IsQuantity(PowerDto, options))
}
