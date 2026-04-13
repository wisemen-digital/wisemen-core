import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum VoltageUnit {
  VOLT = 'V',
  MILLIVOLT = 'mV',
  KILOVOLT = 'kV'
}

export function VoltageUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: VoltageUnit,
    enumName: 'VoltageUnit',
    example: VoltageUnit.VOLT
  })
}
