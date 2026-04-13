import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { TemperatureUnit, TemperatureUnitApiProperty } from './temperature-unit.enum.js'
import { Temperature } from './temperature.js'

export class TemperatureDto extends QuantityDto<Temperature> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @TemperatureUnitApiProperty()
  @IsEnum(TemperatureUnit)
  unit: TemperatureUnit

  static from (temperature: undefined): undefined
  static from (temperature: null): null
  static from (temperature: Temperature): TemperatureDto
  static from (temperature: undefined | null): undefined | null
  static from (temperature: Temperature | null): TemperatureDto | null
  static from (temperature: Temperature | undefined): TemperatureDto | undefined
  static from (temperature: Temperature | null | undefined): TemperatureDto | null | undefined
  static from (temperature: Temperature | null | undefined): TemperatureDto | null | undefined {
    if (temperature === null) return null
    if (temperature === undefined) return undefined

    return new TemperatureDtoBuilder()
      .withValue(temperature.value)
      .withUnit(temperature.unit)
      .build()
  }

  parse (): Temperature {
    return new Temperature(this.value, this.unit)
  }
}

export class TemperatureDtoBuilder {
  private readonly dto: TemperatureDto

  constructor () {
    this.dto = new TemperatureDto()
    this.dto.value = 0
    this.dto.unit = TemperatureUnit.CELSIUS
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: TemperatureUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): TemperatureDto {
    return this.dto
  }
}
