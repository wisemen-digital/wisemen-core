import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { DurationDto } from './duration.dto.js'
import { DurationUnit } from './duration-unit.enum.js'
import { Duration } from './duration.js'

export function IsDuration (
  options?: IsQuantityOptions<DurationUnit, Duration>
): PropertyDecorator {
  return applyDecorators(IsQuantity(DurationDto, options))
}
