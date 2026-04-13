import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum SpeedUnit {
  METER_PER_SECOND = 'm/s',

  KILOMETER_PER_HOUR = 'km/h',
  MILES_PER_HOUR = 'mph',
  KNOT = 'kn',
  FOOT_PER_SECOND = 'ft/s',
  INCH_PER_SECOND = 'in/s',
  YARD_PER_SECOND = 'yd/s',
  CENTIMETER_PER_SECOND = 'cm/s',
  MILLIMETER_PER_SECOND = 'mm/s',
  MICROMETER_PER_SECOND = 'μm/s'
}

export function SpeedUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: SpeedUnit,
    enumName: 'SpeedUnit',
    example: SpeedUnit.METER_PER_SECOND
  })
}
