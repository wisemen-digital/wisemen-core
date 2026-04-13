import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { CurrentUnitApiProperty, CurrentUnit } from './current-unit.enum.js'
import { Current } from './current.js'

export class CurrentDto extends QuantityDto<Current> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @CurrentUnitApiProperty()
  @IsEnum(CurrentUnit)
  unit: CurrentUnit

  static from (current: undefined): undefined
  static from (current: null): null
  static from (current: Current): CurrentDto
  static from (current: Current | null): CurrentDto | null
  static from (current: Current | undefined): CurrentDto | undefined
  static from (current: Current | null | undefined): CurrentDto | null | undefined

  static from (current: Current | null | undefined): CurrentDto | null | undefined {
    if (current === null) return null
    if (current === undefined) return undefined

    return new CurrentDtoBuilder()
      .withValue(current.value)
      .withUnit(current.unit)
      .build()
  }

  parse (): Current {
    return new Current(this.value, this.unit)
  }
}

export class CurrentDtoBuilder {
  private readonly dto: CurrentDto

  constructor () {
    this.dto = new CurrentDto()
    this.dto.value = 0
    this.dto.unit = CurrentUnit.AMPERE
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: CurrentUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): CurrentDto {
    return this.dto
  }
}
