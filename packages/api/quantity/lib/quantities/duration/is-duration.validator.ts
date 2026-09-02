import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { DurationDto } from './duration.dto.js'
import { Duration } from './duration.js'

export function IsDuration (
  options?: IsQuantityOptions<Duration>
): PropertyDecorator {
  return applyDecorators(IsQuantity(DurationDto, options))
}
