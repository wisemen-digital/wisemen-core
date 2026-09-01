import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber } from 'class-validator'
import { QuantityDto } from '../../quantity.dto.js'
import { Volume } from './volume.js'
import { VolumeUnit, VolumeUnitApiProperty } from './volume-unit.enum.js'

export class VolumeDto extends QuantityDto<Volume> {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @VolumeUnitApiProperty()
  @IsEnum(VolumeUnit)
  unit: VolumeUnit

  static from (volume: undefined): undefined
  static from (volume: null): null
  static from (volume: Volume): VolumeDto
  static from (volume: undefined | null): undefined | null
  static from (volume: Volume | null): VolumeDto | null
  static from (volume: Volume | undefined): VolumeDto | undefined
  static from (volume: Volume | null | undefined): VolumeDto | null | undefined
  static from (volume: Volume | null | undefined): VolumeDto | null | undefined {
    if (volume === null) return null
    if (volume === undefined) return undefined

    return new VolumeDtoBuilder()
      .withValue(volume.value)
      .withUnit(volume.unit)
      .build()
  }

  parse (): Volume {
    return new Volume(this.value, this.unit)
  }
}

export class VolumeDtoBuilder {
  private readonly dto: VolumeDto

  constructor () {
    this.dto = new VolumeDto()
    this.dto.value = 0
    this.dto.unit = VolumeUnit.CUBIC_METER
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withUnit (unit: VolumeUnit): this {
    this.dto.unit = unit

    return this
  }

  build (): VolumeDto {
    return this.dto
  }
}
