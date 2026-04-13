import { applyDecorators } from '@nestjs/common'
import { IsISO8601, ValidateIf, ValidationOptions } from 'class-validator'

export function IsTimestampString (options?: ValidationOptions) {
  return applyDecorators(
    ValidateIf((_obj, val) => {
      return val !== 'infinity' && val !== '+infinity' && val !== '-infinity'
    }, options),
    IsISO8601({ strict: true }, options)
  )
}
