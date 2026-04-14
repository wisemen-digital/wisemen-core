import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { DurationUnit, DurationUnitApiProperty } from './duration-unit.enum.js'
import { Duration } from './duration.js'

export class DurationDto extends QuantityDto<Duration> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @DurationUnitApiProperty()
  @IsEnum(DurationUnit)
  unit: DurationUnit

  static from (duration: undefined): undefined
  static from (duration: null): null
  static from (duration: Duration): DurationDto
  static from (duration: undefined | null): undefined | null
  static from (duration: Duration | null): DurationDto | null
  static from (duration: Duration | undefined): DurationDto | undefined
  static from (duration: Duration | null | undefined): DurationDto | null | undefined
  static from (duration: Duration | null | undefined): DurationDto | null | undefined {
    if (duration === null) return null
    if (duration === undefined) return undefined

    return new DurationDtoBuilder()
      .withValue(duration.value)
      .withUnit(duration.unit)
      .build()
  }

  parse (): Duration {
    return new Duration(this.value, this.unit)
  }
}

export class DurationDtoBuilder {
  private readonly dto: DurationDto

  constructor () {
    this.dto = new DurationDto()
    this.dto.value = 0
    this.dto.unit = DurationUnit.SECONDS
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: DurationUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): DurationDto {
    return this.dto
  }
}
