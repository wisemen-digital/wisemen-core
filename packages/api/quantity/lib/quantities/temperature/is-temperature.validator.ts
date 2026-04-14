import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { TemperatureDto } from './temperature.dto.js'
import { TemperatureUnit } from './temperature-unit.enum.js'
import { Temperature } from './temperature.js'

export function IsTemperature (
  options?: IsQuantityOptions<TemperatureUnit, Temperature>
): PropertyDecorator {
  return applyDecorators(IsQuantity(TemperatureDto, options))
}
