import { Currency } from "../currency.enum.js"
import { MonetaryAmountColumn, MonetaryAmountColumnOptions } from "../monetary-amount.column.js"

type FixedMonetaryAmountColumnOptions<C extends Currency> = 
  Omit<MonetaryAmountColumnOptions<C>, 'currency' | 'monetaryPrecision'>

type MonetaryAmountColumnFactory<C extends Currency> = 
  (options?: FixedMonetaryAmountColumnOptions<C>) => PropertyDecorator 

export function createMonetaryAmountColumn<C extends Currency> (currency: C, monetaryPrecision: number): MonetaryAmountColumnFactory<C> {
  return (options?: FixedMonetaryAmountColumnOptions<C>): PropertyDecorator => {
    return MonetaryAmountColumn({
      ...options,
      currency,
      monetaryPrecision
    })
  }
}
