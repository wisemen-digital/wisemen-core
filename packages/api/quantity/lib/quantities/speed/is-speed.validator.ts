import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { SpeedDto } from './speed.dto.js'
import { SpeedUnit } from './speed-unit.enum.js'
import { Speed } from './speed.js'

export function IsSpeed (
  options?: IsQuantityOptions<SpeedUnit, Speed>
): PropertyDecorator {
  return applyDecorators(IsQuantity(SpeedDto, options))
}
