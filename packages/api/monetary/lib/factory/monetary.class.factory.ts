import { Currency } from "../currency.enum.js";
import { Monetary } from "../monetary.js";
import { MonetaryObject } from "../monetary.object.js";
import { UnsupportedCurrencyError } from "../unsupported-currency-error.js";

type MonetaryConstructor<C extends Currency> = {
  new(object: MonetaryObject<C>): Monetary<C>;
  new(amount: number, precision: number): Monetary<C>;
};

export function createMonetaryClass<C extends Currency>(currency: C, className: string): MonetaryConstructor<C> {
  const FixedCurrencyMonetary = class extends Monetary<C> {
    constructor(object: MonetaryObject<C>);
    constructor(amount: number, precision: number);
    constructor(objectOrAmount: MonetaryObject<C> | number, precision?: number) {
      if (typeof objectOrAmount === 'number') {
        super(objectOrAmount, currency, precision!);
      } else {
        if (objectOrAmount.currency !== currency) {
          throw new UnsupportedCurrencyError(objectOrAmount.currency)
        }
        super(objectOrAmount);
      }
    }
  };

  Object.defineProperty(FixedCurrencyMonetary, 'name', { value: className });

  return FixedCurrencyMonetary;
}
