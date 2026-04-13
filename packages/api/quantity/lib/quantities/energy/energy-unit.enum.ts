import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum EnergyUnit {
  JOULE = 'J',

  DECIJOULE = 'dJ',
  CENTIJOULE = 'cJ',
  MILLIJOULE = 'mJ',
  MICROJOULE = 'μJ',
  NANOJOULE = 'nJ',
  PICOJOULE = 'pJ',
  FEMTOJOULE = 'fJ',
  ATTOJOULE = 'aJ',
  ZEPTOJOULE = 'zJ',
  YOCTOJOULE = 'yJ',
  RONTOJOULE = 'rJ',
  QUECTOJOULE = 'qJ',

  DECAJOULE = 'daJ',
  HECTOJOULE = 'hJ',
  KILOJOULE = 'kJ',
  MEGAJOULE = 'MJ',
  GIGAJOULE = 'GJ',
  TERAJOULE = 'TJ',
  PETAJOULE = 'PJ',
  EXAJOULE = 'EJ',
  ZETTAJOULE = 'ZJ',
  YOTTAJOULE = 'YJ',
  RONNAJOULE = 'RJ',
  QUETAJOULE = 'QJ',

  WATT_HOUR = 'Wh',
  KILOWATT_HOUR = 'kWh',
  MEGAWATT_HOUR = 'MWh',
  GIGAWATT_HOUR = 'GWh',
  TERAWATT_HOUR = 'TWh',
  PETAWATT_HOUR = 'PWh',
  EXAWATT_HOUR = 'EWh',
  ZETTAWATT_HOUR = 'ZWh',
  YOTTAWATT_HOUR = 'YWh',
  RONNAWATT_HOUR = 'RWh',
  QUETTAWATT_HOUR = 'QWh'
}

export function EnergyUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: EnergyUnit,
    enumName: 'EnergyUnitEnum',
    example: EnergyUnit.JOULE
  })
}
