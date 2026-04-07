import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { Speed } from './speed.js'
import { SpeedUnit, SpeedUnitApiProperty } from './speed-unit.enum.js'

export class SpeedDto extends QuantityDto<Speed> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @SpeedUnitApiProperty()
  @IsEnum(SpeedUnit)
  unit: SpeedUnit

  static from (speed: undefined): undefined
  static from (speed: null): null
  static from (speed: Speed): SpeedDto
  static from (speed: undefined | null): undefined | null
  static from (speed: Speed | null): SpeedDto | null
  static from (speed: Speed | undefined): SpeedDto | undefined
  static from (speed: Speed | null | undefined): SpeedDto | null | undefined
  static from (speed: Speed | null | undefined): SpeedDto | null | undefined {
    if (speed === null) return null
    if (speed === undefined) return undefined

    return new SpeedDtoBuilder()
      .withValue(speed.value)
      .withUnit(speed.unit)
      .build()
  }

  parse (): Speed {
    return new Speed(this.value, this.unit)
  }
}

export class SpeedDtoBuilder {
  private readonly dto: SpeedDto

  constructor () {
    this.dto = new SpeedDto()
    this.dto.value = 0
    this.dto.unit = SpeedUnit.METER_PER_SECOND
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: SpeedUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): SpeedDto {
    return this.dto
  }
}
