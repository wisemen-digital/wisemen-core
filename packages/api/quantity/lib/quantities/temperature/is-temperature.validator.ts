import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { TemperatureDto } from './temperature.dto.js'
import { Temperature } from './temperature.js'

export function IsTemperature (
  options?: IsQuantityOptions<Temperature>
): PropertyDecorator {
  return applyDecorators(IsQuantity(TemperatureDto, options))
}
