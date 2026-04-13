import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum TemperatureUnit {
  KELVIN = 'K',
  CELSIUS = 'C',
  FAHRENHEIT = 'F',
  MILLI_DEGREE_CELSIUS = 'mC'
}

export function TemperatureUnitApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: TemperatureUnit,
    enumName: 'TemperatureUnit',
    example: TemperatureUnit.CELSIUS
  })
}
