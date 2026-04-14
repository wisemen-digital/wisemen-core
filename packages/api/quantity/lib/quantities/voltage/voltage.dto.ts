import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { QuantityDto } from '../../quantity.dto.js'
import { VoltageUnit, VoltageUnitApiProperty } from './voltage-unit.enum.js'
import { Voltage } from './voltage.js'

export class VoltageDto extends QuantityDto<Voltage> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @VoltageUnitApiProperty()
  @IsEnum(VoltageUnit)
  unit: VoltageUnit

  static from (voltage: undefined): undefined
  static from (voltage: null): null
  static from (voltage: Voltage): VoltageDto
  static from (voltage: undefined | null): undefined | null
  static from (voltage: Voltage | null): VoltageDto | null
  static from (voltage: Voltage | undefined): VoltageDto | undefined
  static from (voltage: Voltage | null | undefined): VoltageDto | null | undefined
  static from (voltage: Voltage | null | undefined): VoltageDto | null | undefined {
    if (voltage === null) return null
    if (voltage === undefined) return undefined

    return new VoltageDtoBuilder()
      .withValue(voltage.value)
      .withUnit(voltage.unit)
      .build()
  }

  parse (): Voltage {
    return new Voltage(this.value, this.unit)
  }
}

export class VoltageDtoBuilder {
  private readonly dto: VoltageDto

  constructor () {
    this.dto = new VoltageDto()
    this.dto.value = 0
    this.dto.unit = VoltageUnit.VOLT
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: VoltageUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): VoltageDto {
    return this.dto
  }
}
