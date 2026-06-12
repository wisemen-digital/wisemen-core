import { ApiProperty } from "@nestjs/swagger"
import { MonetaryApiPropertyOptions } from "../monetary.api-property.js"
import { Currency } from "../currency.enum.js"

type MonetaryApiPropertyFactory = 
  (options?: MonetaryApiPropertyOptions) => PropertyDecorator

export function createMonetaryApiProperty (currency: Currency, maxPrecision: number): MonetaryApiPropertyFactory {
  return (): PropertyDecorator => {
    return ApiProperty({
      type: 'object',
      properties: {
        amount: { type: 'number' },
        currency: { enum: [currency], enumName: `${currency}Currency` },
        precision: { type: 'number', maximum: maxPrecision }
      }
    })
  }
}
