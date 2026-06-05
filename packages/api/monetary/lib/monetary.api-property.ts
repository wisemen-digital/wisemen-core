import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger"
import { MonetaryDto } from "./monetary.dto.js"

export type MonetaryApiPropertyOptions = Omit<Extract<ApiPropertyOptions, { type: MonetaryDto }>, 'type'>

export function MonetaryApiProperty (options?: MonetaryApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    type: MonetaryDto,
    ...options,
  })
}
