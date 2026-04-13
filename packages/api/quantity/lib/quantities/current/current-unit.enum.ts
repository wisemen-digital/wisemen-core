import { ApiPropertyOptions, ApiProperty } from '@nestjs/swagger'

export enum CurrentUnit {
  AMPERE = 'A',

  DECIAMPERE = 'dA',
  CENTIAMPERE = 'cA',
  MILLIAMPERE = 'mA',
  MICROAMPERE = 'μA',
  NANOAMPERE = 'nA',
  PICOAMPERE = 'pA',
  FEMTOAMPERE = 'fA',
  ATTOAMPERE = 'aA',
  ZEPTOAMPERE = 'zA',
  YOCTOAMPERE = 'yA',
  RONTOAMPERE = 'rA',
  QUECTOAMPERE = 'qA',

  DECAAMPERE = 'daA',
  HECTOAMPERE = 'hA',
  KILOAMPERE = 'kA',
  MEGAAMPERE = 'MA',
  GIGAAMPERE = 'GA',
  TERAAMPERE = 'TA',
  PETAAMPERE = 'PA',
  EXAAMPERE = 'EA',
  ZETTAAMPERE = 'ZA',
  YOTTAAMPERE = 'YA',
  RONNAAMPERE = 'RA',
  QUETTAAMPERE = 'QA'
}

export function CurrentUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: CurrentUnit,
    enumName: 'CurrentUnitEnum',
    example: CurrentUnit.AMPERE
  })
}
