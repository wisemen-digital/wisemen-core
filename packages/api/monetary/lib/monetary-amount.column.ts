import { Column, ColumnOptions, ValueTransformer } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { PrecisionLossError } from './precision-loss-error.js'
import { UnsupportedCurrencyError } from './unsupported-currency-error.js'

export type MonetaryAmountColumnOptions = {
  currency: Currency
  monetaryPrecision: number
  type?: 'int' | 'int2' | 'int4' | 'int8' | 'integer' | 'tinyint' | 'smallint' | 'mediumint' | 'bigint'
  default?: Monetary
} & Omit<ColumnOptions, 'type' | 'transformer' | 'default'>

/** Stores the amount as an int */
export function MonetaryAmountColumn (options: MonetaryAmountColumnOptions): PropertyDecorator {
  const transformer = new MoneyTypeOrmAmountTransformer(options.currency, options.monetaryPrecision)

  return Column({
    ...options,
    type: options.type ?? 'int',
    default: transformer.to(options.default),
    transformer
  })
}

export class MoneyTypeOrmAmountTransformer implements ValueTransformer {
  public constructor (
    private readonly currency: Currency,
    private readonly precision: number
  ) {
    if (!Number.isInteger(this.precision)) {
      throw new Error('precision must be an integer')
    }
  }

  from (amount: number): Monetary
  from (amount: null): null
  from (amount: number | null): Monetary | null
  from (amount: number | null): Monetary | null {
    if (amount === null) {
      return null
    }

    return new Monetary(amount, this.currency, this.precision)
  }

  to (amount: Monetary): number
  to (amount: null): null
  to (amount: undefined): undefined
  to (amount: null | undefined): null | undefined
  to (monetary: Monetary | null): number | null
  to (monetary: Monetary | undefined): number | undefined
  to (monetary: Monetary | null | undefined): number | null | undefined
  to (monetary: Monetary | null | undefined): number | null | undefined {
    if (monetary === undefined || monetary === null) {
      return monetary
    }

    if (monetary.currency !== this.currency) {
      throw new UnsupportedCurrencyError(monetary.currency)
    }

    if (monetary.precision > this.precision) {
      throw new PrecisionLossError()
    }

    const normalizedAmount = monetary.toPrecision(this.precision)

    if (!normalizedAmount.isRounded()) {
      throw new Error('Attempting to store a non rounded monetary value!')
    }

    return normalizedAmount.amount
  }
}
