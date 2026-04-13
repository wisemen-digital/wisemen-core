import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum PowerUnit {
  WATT = 'W',

  DECIWATT = 'dW',
  CENTIWATT = 'cW',
  MILLIWATT = 'mW',
  MICROWATT = 'μW',
  NANOWATT = 'nW',
  PICOWATT = 'pW',
  FEMTOWATT = 'fW',
  ATTOWATT = 'aW',
  ZEPTOWATT = 'zW',
  YOCTOWATT = 'yW',
  RONTOWATT = 'rW',
  QUECTOWATT = 'qW',

  DECAWATT = 'daW',
  HECTOWATT = 'hW',
  KILOWATT = 'kW',
  MEGAWATT = 'MW',
  GIGAWATT = 'GW',
  TERAWATT = 'TW',
  PETAWATT = 'PW',
  EXAWATT = 'EW',
  ZETTAWATT = 'ZW',
  YOTTAWATT = 'YW',
  RONNAWATT = 'RW',
  QUETTAWATT = 'QW'
}

export function PowerUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: PowerUnit,
    enumName: 'PowerUnitEnum',
    example: PowerUnit.WATT
  })
}
