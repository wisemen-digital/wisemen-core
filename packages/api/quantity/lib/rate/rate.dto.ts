import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { Rate } from './rate.js'
import { RateScale, RateScaleApiProperty } from './rate-scale.enum.js'
import { exhaustiveCheck } from '#lib/exhaustive-check.js'

export class RateDto {
  @ApiProperty({ type: Number })
  @Type(() => Number)
  @IsNumber()
  value: number

  @RateScaleApiProperty()
  @IsEnum(RateScale)
  scale: RateScale

  static from (rate: undefined): undefined
  static from (rate: null): null
  static from (rate: Rate): RateDto
  static from (rate: Rate | null): RateDto | null
  static from (rate: Rate | undefined): RateDto | undefined
  static from (rate: Rate | null | undefined): RateDto | null | undefined
  static from (rate: Rate | null | undefined): RateDto | null | undefined {
    if (rate === null) return null
    if (rate === undefined) return undefined

    return new RateDtoBuilder()
      .withValue(rate.asDecimal())
      .withScale(RateScale.DECIMAL)
      .build()
  }

  parse (): Rate {
    switch (this.scale) {
      case RateScale.DECIMAL:
        return Rate.fromDecimal(this.value)
      case RateScale.PERCENT:
        return Rate.fromPercent(this.value)
      case RateScale.PERMILLE:
        return Rate.fromPermille(this.value)
      default:
        exhaustiveCheck(this.scale)
    }
  }
}

export class RateDtoBuilder {
  private readonly dto: RateDto

  constructor () {
    this.dto = new RateDto()
    this.dto.value = 0
    this.dto.scale = RateScale.DECIMAL
  }

  withValue (value: number): this {
    this.dto.value = value

    return this
  }

  withScale (scale: RateScale): this {
    this.dto.scale = scale

    return this
  }

  build (): RateDto {
    return this.dto
  }
}
