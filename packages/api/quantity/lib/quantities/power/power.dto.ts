import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { PowerUnitApiProperty, PowerUnit } from './power-unit.enum.js'
import { Power } from './power.js'

export class PowerDto extends QuantityDto<Power> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @PowerUnitApiProperty()
  @IsEnum(PowerUnit)
  unit: PowerUnit

  static from (power: undefined): undefined
  static from (power: null): null
  static from (power: Power): PowerDto
  static from (power: undefined | null): undefined | null
  static from (power: Power | null): PowerDto | null
  static from (power: Power | undefined): PowerDto | undefined
  static from (power: Power | null | undefined): PowerDto | null | undefined
  static from (power: Power | null | undefined): PowerDto | null | undefined {
    if (power === null) return null
    if (power === undefined) return undefined

    return new PowerDtoBuilder()
      .withValue(power.value)
      .withUnit(power.unit)
      .build()
  }

  parse (): Power {
    return new Power(this.value, this.unit)
  }
}

export class PowerDtoBuilder {
  private readonly dto: PowerDto

  constructor () {
    this.dto = new PowerDto()
    this.dto.value = 0
    this.dto.unit = PowerUnit.WATT
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: PowerUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): PowerDto {
    return this.dto
  }
}
