import { createMonetaryAmountColumn } from "./monetary-amount.column.factory.js";
import { createMonetaryValidator } from "./monetary.validator.factory.js";
import { createMonetaryApiProperty } from "./monetary.api-property.factory.js";
import { Currency } from "../currency.enum.js";
import { createMonetaryClass } from "./monetary.class.factory.js";
import { createMonetaryDto } from "./monetary.dto.factory.js";
import { createMonetaryDtoBuilder } from "./monetary.dto.builder.factory.js";

export function createMonetaryUtils<C extends Currency> (currency: C, monetaryPrecision: number, className: string) {
  return {
    Column: createMonetaryAmountColumn(currency, monetaryPrecision),
    ApiProperty: createMonetaryApiProperty(currency, monetaryPrecision),
    Validator: createMonetaryValidator(currency, monetaryPrecision),
    Class: createMonetaryClass(currency, className),
    Dto: createMonetaryDto(currency, className),
    DtoBuilder: createMonetaryDtoBuilder(currency, className)
  }
}
