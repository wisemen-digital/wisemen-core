import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { Mass } from './mass.js'
import { MassUnit, MassUnitApiProperty } from './mass-unit.enum.js'

export class MassDto extends QuantityDto<Mass> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @MassUnitApiProperty()
  @IsEnum(MassUnit)
  unit: MassUnit

  static from (mass: undefined): undefined
  static from (mass: null): null
  static from (mass: Mass): MassDto
  static from (mass: undefined | null): undefined | null
  static from (mass: Mass | null): MassDto | null
  static from (mass: Mass | undefined): MassDto | undefined
  static from (mass: Mass | null | undefined): MassDto | null | undefined
  static from (mass: Mass | null | undefined): MassDto | null | undefined {
    if (mass === null) return null
    if (mass === undefined) return undefined

    return new MassDtoBuilder()
      .withValue(mass.value)
      .withUnit(mass.unit)
      .build()
  }

  parse (): Mass {
    return new Mass(this.value, this.unit)
  }
}

export class MassDtoBuilder {
  private readonly dto: MassDto

  constructor () {
    this.dto = new MassDto()
    this.dto.value = 0
    this.dto.unit = MassUnit.KILOGRAM
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: MassUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): MassDto {
    return this.dto
  }
}
