import { Column, ColumnOptions, ValueTransformer } from 'typeorm'
import { Monetary } from './monetary.js'
import { Currency } from './currency.enum.js'
import { PrecisionLossError } from './precision-loss-error.js'

export type MonetaryOptions = {
  currencyPrecisions?: Record<Currency, number>
  defaultPrecision: number
  default?: Monetary
} & Omit<ColumnOptions, 'type' | 'transformer' | 'default'>

export interface MonetaryJSON {
  amount: number
  currency: Currency
}

/** Stores the amount and currency as jsonb */
export function MonetaryColumn (options: MonetaryOptions): PropertyDecorator {
  const transformer = new MoneyTypeOrmTransformer(
    options.defaultPrecision,
    options.currencyPrecisions ?? {} as Record<Currency, number>
  )

  return Column({
    ...options,
    type: 'jsonb',
    default: transformer.to(options.default),
    transformer
  })
}

export class MoneyTypeOrmTransformer implements ValueTransformer {
  public constructor (
    private readonly defaultPrecision: number,
    private readonly currencyPrecision: Record<Currency, number>
  ) {
    if (
      !Number.isInteger(this.defaultPrecision)
      || Object.values(currencyPrecision).some(precision => !Number.isInteger(precision))
    ) {
      throw new Error('precision must be an integer')
    }
  }

  from (monetary: MonetaryJSON | null): Monetary | null {
    if (monetary === null) {
      return null
    }

    const precision = this.getPrecisionFor(monetary.currency)

    return new Monetary(monetary.amount, monetary.currency, precision)
  }

  to (monetary: Monetary | null | undefined): MonetaryJSON | null | undefined {
    if (monetary === undefined || monetary === null) {
      return monetary
    }

    const precision = this.getPrecisionFor(monetary.currency)

    if (monetary.precision > precision) {
      throw new PrecisionLossError()
    }

    const normalizedMonetary = monetary.toPrecision(precision)

    if (!normalizedMonetary.isRounded()) {
      throw new Error('Attempting to store a non rounded monetary value!')
    }

    return {
      amount: normalizedMonetary.amount,
      currency: normalizedMonetary.currency
    }
  }

  private getPrecisionFor (currency: Currency) {
    return this.currencyPrecision[currency] ?? this.defaultPrecision
  }
}
