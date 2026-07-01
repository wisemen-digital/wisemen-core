import { Currency } from "../currency.enum.js";
import { MonetaryDtoBuilder } from "../monetary.dto.js";

export type MonetaryDtoBuilderConstructor<C extends Currency> = {
  new(): MonetaryDtoBuilder<C>;
};

export function createMonetaryDtoBuilder<C extends Currency>(currency: C, className: string): MonetaryDtoBuilderConstructor<C> {
  const FixedCurrencyMonetaryDtoBuilder = class extends MonetaryDtoBuilder<C> {
    constructor() {
      super(currency);
    }
  };

  Object.defineProperty(FixedCurrencyMonetaryDtoBuilder, 'name', { value: `${className}Builder` });

  return FixedCurrencyMonetaryDtoBuilder;
}
