import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum MassUnit {
  KILOGRAM = 'kg',

  GRAM = 'g',
  DECIGRAM = 'dg',
  CENTIGRAM = 'cg',
  MILLIGRAM = 'mg',
  MICROGRAM = 'μg',
  NANOGRAM = 'ng',

  DECAGRAM = 'dag',
  HECTOGRAM = 'hg',

  TONNE = 't',

  POUND = 'lb',
  OUNCE = 'oz'
}

export function MassUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: MassUnit,
    enumName: 'MassUnit',
    example: MassUnit.KILOGRAM
  })
}
