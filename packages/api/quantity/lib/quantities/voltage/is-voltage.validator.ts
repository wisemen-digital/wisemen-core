import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { VoltageUnit } from './voltage-unit.enum.js'
import { Voltage } from './voltage.js'
import { VoltageDto } from './voltage.dto.js'

export function IsVoltage (
  options?: IsQuantityOptions<VoltageUnit, Voltage>
): PropertyDecorator {
  return applyDecorators(IsQuantity(VoltageDto, options))
}
