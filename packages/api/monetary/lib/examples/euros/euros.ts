import { createMonetaryUtils } from "../../factory/monetary.factory.js"
import { Monetary } from "../../monetary.js"
import { MonetaryDto, MonetaryDtoBuilder } from "../../monetary.dto.js"
import { MonetaryObject } from "../../monetary.object.js"
import { Currency } from "../../currency.enum.js"

export class Euros extends Monetary<Currency.EUR> {
  constructor (object: MonetaryObject<Currency.EUR>);
  constructor (amount: number, precision: number);
  constructor (objectOrAmount: MonetaryObject<Currency.EUR> | number, precision?: number) {
    if (typeof objectOrAmount === 'number') {
      super(objectOrAmount, Currency.EUR, precision!)
    } else {
      super(objectOrAmount)
    }
  }
}

export class EurosDto extends MonetaryDto<Currency.EUR> {}

export class EurosDtoBuilder extends MonetaryDtoBuilder<Currency.EUR> {
  constructor () {
    super(Currency.EUR)
  }
}

export const {
  Column: EurosColumn,
  ApiProperty: EurosApiProperty,
  Validator: IsEuros
} = createMonetaryUtils(Currency.EUR, 2)
