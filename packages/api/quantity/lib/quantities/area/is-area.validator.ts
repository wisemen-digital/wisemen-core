import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { Area } from './area.js'
import { AreaDto } from './area.dto.js'

export function IsArea (
  options?: IsQuantityOptions<Area>
): PropertyDecorator {
  return applyDecorators(IsQuantity(AreaDto, options))
}
