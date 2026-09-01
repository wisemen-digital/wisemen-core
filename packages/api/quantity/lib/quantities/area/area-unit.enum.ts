import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum AreaUnit {
  SQUARE_METER = 'm²',

  SQUARE_DECIMETER = 'dm²',
  SQUARE_CENTIMETER = 'cm²',
  SQUARE_MILLIMETER = 'mm²',

  SQUARE_KILOMETER = 'km²',
  HECTARE = 'ha',

  SQUARE_INCH = 'in²',
  SQUARE_FOOT = 'ft²',
  SQUARE_YARD = 'yd²',
  ACRE = 'ac',
  SQUARE_MILE = 'mi²'
}

export function AreaUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: AreaUnit,
    enumName: 'AreaUnit',
    example: AreaUnit.SQUARE_METER
  })
}
