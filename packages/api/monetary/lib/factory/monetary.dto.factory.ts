import { Currency } from "../currency.enum.js";
import { MonetaryDto, MonetaryDtoBuilder } from "../monetary.dto.js";

type MonetaryDtoConstructor<C extends Currency> = {
  new(): MonetaryDto<C>;
};

export function createMonetaryDto<C extends Currency>(currency: C, className: string): MonetaryDtoConstructor<C> {
  const FixedCurrencyMonetaryDto = class extends MonetaryDto<C> { };

  Object.defineProperty(FixedCurrencyMonetaryDto, 'name', { value: `${className}Dto` });

  return FixedCurrencyMonetaryDto;
}
