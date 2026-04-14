import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '../../validators/is-quantity.decorator.js'
import { CurrentDto } from './current.dto.js'
import { CurrentUnit } from './current-unit.enum.js'
import { Current } from './current.js'

export function IsCurrent (
  options?: IsQuantityOptions<CurrentUnit, Current>
): PropertyDecorator {
  return applyDecorators(IsQuantity(CurrentDto, options))
}
