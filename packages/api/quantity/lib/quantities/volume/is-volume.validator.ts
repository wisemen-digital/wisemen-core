import { applyDecorators } from '@nestjs/common'
import { IsQuantity, IsQuantityOptions } from '#lib/validators/is-quantity.decorator.js'
import { Volume } from './volume.js'
import { VolumeDto } from './volume.dto.js'

export function IsVolume (
  options?: IsQuantityOptions<Volume>
): PropertyDecorator {
  return applyDecorators(IsQuantity(VolumeDto, options))
}
