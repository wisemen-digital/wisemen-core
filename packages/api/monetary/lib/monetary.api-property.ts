import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger"
import { MonetaryDto } from "./monetary.dto.js"
import { Currency } from "./currency.enum.js"

export type MonetaryApiPropertyOptions = Omit<Extract<ApiPropertyOptions, { type: 'object' }>, 'type' | 'properties'>

export function MonetaryApiProperty (options?: MonetaryApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    type: 'object',
    properties: {
      amount: { type: 'number' },
      currency: { type: 'string', enum: Currency },
      precision: { type: 'number' }
    },
    ...options
  })
}
