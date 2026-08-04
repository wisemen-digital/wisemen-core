import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt } from 'class-validator'
import { Currency, CurrencyApiProperty } from './currency.enum.js'
import { Monetary } from './monetary.js'
import { Type } from 'class-transformer'

export class MonetaryDto <C extends Currency = Currency> {
  @ApiProperty({ type: 'integer', example: 499 })
  @Type(() => Number)
  @IsInt()
  amount: number
  
  @CurrencyApiProperty()
  @IsEnum(Currency)
  currency: C
  
  @ApiProperty({ type: 'integer', example: 2 })
  @Type(() => Number)
  @IsInt()
  precision: number

  static from (monetary: undefined): undefined
  static from (monetary: null): null
  static from (monetary: undefined | null): undefined | null
  static from <C extends Currency> (monetary: Monetary<C>): MonetaryDto<C>
  static from <C extends Currency> (monetary: Monetary<C> | null): MonetaryDto<C> | null
  static from <C extends Currency> (monetary: Monetary<C> | undefined): MonetaryDto<C> | undefined
  static from <C extends Currency> (monetary: Monetary<C> | null | undefined): MonetaryDto<C> | null | undefined
  static from <C extends Currency> (monetary: Monetary<C> | null | undefined): MonetaryDto<C> | null | undefined {
    if (monetary === null) return null
    if (monetary === undefined) return undefined

    return new MonetaryDtoBuilder<C>(monetary.currency)
      .withAmount(monetary.amount)
      .withCurrency(monetary.currency)
      .withPrecision(monetary.precision)
      .build()
  }

  parse (): Monetary<C> {
    return new Monetary<C>(this)
  }
}

export class MonetaryDtoBuilder <C extends Currency = Currency> {
  private readonly dto: MonetaryDto<C>

  constructor (defaultCurrency: C) {
    this.dto = new MonetaryDto()
    this.dto.amount = 0
    this.dto.currency = defaultCurrency
    this.dto.precision = 4
  }

  withAmount (amount: number): this {
    this.dto.amount = amount

    return this
  }

  withCurrency (currency: C): this {
    this.dto.currency = currency

    return this
  }

  withPrecision (precision: number): this {
    this.dto.precision = precision

    return this
  }

  build (): MonetaryDto<C> {
    return this.dto
  }
}
