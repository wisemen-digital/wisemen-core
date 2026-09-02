import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber } from 'class-validator'
import { QuantityDto } from '../../quantity.dto.js'
import { Area } from './area.js'
import { AreaUnit, AreaUnitApiProperty } from './area-unit.enum.js'

export class AreaDto extends QuantityDto<Area> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @AreaUnitApiProperty()
  @IsEnum(AreaUnit)
  unit: AreaUnit

  static from (area: undefined): undefined
  static from (area: null): null
  static from (area: Area): AreaDto
  static from (area: undefined | null): undefined | null
  static from (area: Area | null): AreaDto | null
  static from (area: Area | undefined): AreaDto | undefined
  static from (area: Area | null | undefined): AreaDto | null | undefined
  static from (area: Area | null | undefined): AreaDto | null | undefined {
    if (area === null) return null
    if (area === undefined) return undefined

    return new AreaDtoBuilder()
      .withValue(area.value)
      .withUnit(area.unit)
      .build()
  }

  parse (): Area {
    return new Area(this.value, this.unit)
  }
}

export class AreaDtoBuilder {
  private readonly dto: AreaDto

  constructor () {
    this.dto = new AreaDto()
    this.dto.value = 0
    this.dto.unit = AreaUnit.SQUARE_METER
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: AreaUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): AreaDto {
    return this.dto
  }
}
