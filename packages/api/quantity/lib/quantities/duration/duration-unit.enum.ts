import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum DurationUnit {
  SECONDS = 's',

  MILLISECONDS = 'ms',
  MICROSECONDS = 'μs',
  NANOSECONDS = 'ns',

  MINUTES = 'm',
  HOURS = 'h',

  /** 24hr days */
  DAYS = 'days'
}

export function DurationUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: DurationUnit,
    enumName: 'DurationUnit',
    example: DurationUnit.SECONDS
  })
}
