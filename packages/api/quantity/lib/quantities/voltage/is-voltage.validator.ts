import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { Voltage } from './voltage.js'
import { VoltageDto } from './voltage.dto.js'

export function IsVoltage (
  options?: IsQuantityOptions<Voltage>
): PropertyDecorator {
  return applyDecorators(IsQuantity(VoltageDto, options))
}
