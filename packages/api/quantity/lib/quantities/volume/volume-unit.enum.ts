import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum VolumeUnit {
  CUBIC_METER = 'm³',

  CUBIC_DECIMETER = 'dm³',
  CUBIC_CENTIMETER = 'cm³',
  CUBIC_MILLIMETER = 'mm³',
  CUBIC_KILOMETER = 'km³',

  LITER = 'L',
  MILLILITER = 'mL',

  CUBIC_INCH = 'in³',
  CUBIC_FOOT = 'ft³',
  CUBIC_YARD = 'yd³',
  US_GALLON = 'gal',
  CUBIC_MILE = 'mi³'
}

export function VolumeUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: VolumeUnit,
    enumName: 'VolumeUnit',
    example: VolumeUnit.CUBIC_METER
  })
}
