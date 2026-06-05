import { createMonetaryAmountColumn } from "./monetary-amount.column.factory.js";
import { createMonetaryValidator } from "./monetary.validator.factory.js";
import { createMonetaryApiProperty } from "./monetary.api-property.factory.js";
import { Currency } from "../currency.enum.js";

export function createMonetaryAmountUtils<C extends Currency> (currency: C, monetaryPrecision: number) {
  return {
    AmountColumn: createMonetaryAmountColumn(currency, monetaryPrecision),
    ApiProperty: createMonetaryApiProperty(currency, monetaryPrecision),
    Validator: createMonetaryValidator(currency, monetaryPrecision)
  }
}
