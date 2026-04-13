import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { Distance } from './distance.js'
import { DistanceUnit, DistanceUnitApiProperty } from './distance-unit.enum.js'

export class DistanceDto extends QuantityDto<Distance> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @DistanceUnitApiProperty()
  @IsEnum(DistanceUnit)
  unit: DistanceUnit

  static from (distance: undefined): undefined
  static from (distance: null): null
  static from (distance: Distance): DistanceDto
  static from (distance: undefined | null): undefined | null
  static from (distance: Distance | null): DistanceDto | null
  static from (distance: Distance | undefined): DistanceDto | undefined
  static from (distance: Distance | null | undefined): DistanceDto | null | undefined
  static from (distance: Distance | null | undefined): DistanceDto | null | undefined {
    if (distance === null) return null
    if (distance === undefined) return undefined

    return new DistanceDtoBuilder()
      .withValue(distance.value)
      .withUnit(distance.unit)
      .build()
  }

  parse (): Distance {
    return new Distance(this.value, this.unit)
  }
}

export class DistanceDtoBuilder {
  private readonly dto: DistanceDto

  constructor () {
    this.dto = new DistanceDto()
    this.dto.value = 0
    this.dto.unit = DistanceUnit.METER
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: DistanceUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): DistanceDto {
    return this.dto
  }
}
