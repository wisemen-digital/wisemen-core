import { createMonetaryUtils } from "../../factory/monetary.factory.js"
import { Currency } from "../../currency.enum.js"

export const {
  Column: EurosColumn,
  ApiProperty: EurosApiProperty,
  Validator: IsEuros,
  Class: Euros,
  Dto: EurosDto,
  DtoBuilder: EurosDtoBuilder
} = createMonetaryUtils(Currency.EUR, 2, 'Euros')

export type Euros = InstanceType<typeof Euros>
export type EurosDto = InstanceType<typeof EurosDto>
export type EurosDtoBuilder = InstanceType<typeof EurosDtoBuilder>
