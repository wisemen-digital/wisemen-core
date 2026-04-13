import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { Energy } from './energy.js'
import { EnergyUnit, EnergyUnitApiProperty } from './energy-unit.enum.js'

export class EnergyDto extends QuantityDto<Energy> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @EnergyUnitApiProperty()
  @IsEnum(EnergyUnit)
  unit: EnergyUnit

  static from (energy: undefined): undefined
  static from (energy: null): null
  static from (energy: Energy): EnergyDto
  static from (energy: Energy | null): EnergyDto | null
  static from (energy: Energy | undefined): EnergyDto | undefined
  static from (energy: Energy | null | undefined): EnergyDto | null | undefined

  static from (energy: Energy | null | undefined): EnergyDto | null | undefined {
    if (energy === null) return null
    if (energy === undefined) return undefined

    return new EnergyDtoBuilder()
      .withValue(energy.value)
      .withUnit(energy.unit)
      .build()
  }

  parse (): Energy {
    return new Energy(this.value, this.unit)
  }
}

export class EnergyDtoBuilder {
  private readonly dto: EnergyDto

  constructor () {
    this.dto = new EnergyDto()
    this.dto.value = 0
    this.dto.unit = EnergyUnit.JOULE
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: EnergyUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): EnergyDto {
    return this.dto
  }
}
