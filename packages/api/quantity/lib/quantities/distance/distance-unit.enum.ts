import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum DistanceUnit {
  METER = 'm',

  DECIMETER = 'dm',
  CENTIMETER = 'cm',
  MILLIMETER = 'mm',
  MICROMETER = 'μm',
  NANOMETER = 'nm',

  DECAMETER = 'dam',
  HECTOMETER = 'hm',
  KILOMETER = 'km',

  MILES = 'mi',
  INCH = 'in',
  FOOT = 'ft',
  YARD = 'yd'
}

export function DistanceUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: DistanceUnit,
    enumName: 'DistanceUnit',
    example: DistanceUnit.METER
  })
}
