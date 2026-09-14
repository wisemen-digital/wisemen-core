import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { PowerDto } from './power.dto.js'
import { Power } from './power.js'

export function IsPower (
  options?: IsQuantityOptions<Power>
): PropertyDecorator {
  return applyDecorators(IsQuantity(PowerDto, options))
}
