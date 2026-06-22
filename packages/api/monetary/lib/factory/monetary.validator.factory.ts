import { Currency } from "../currency.enum.js"
import { IsMonetary, IsMonetaryOptions } from "../monetary.validator.js"

type FixedMonetaryValidatorOptions = 
  Omit<IsMonetaryOptions, 'maxPrecision' | 'allowedCurrencies'>

type MonetaryValidatorFactory = 
  (options?: FixedMonetaryValidatorOptions) => PropertyDecorator

export function createMonetaryValidator(currency: Currency, maxPrecision?: number): MonetaryValidatorFactory {
  return (options?: FixedMonetaryValidatorOptions): PropertyDecorator => {
    return IsMonetary({
      ...options,
      allowedCurrencies: new Set<Currency>([currency]),
      maxPrecision
    })
  }
}
