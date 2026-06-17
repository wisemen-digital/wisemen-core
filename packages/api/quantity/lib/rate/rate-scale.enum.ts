import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

export enum RateScale {
  DECIMAL = 'decimal',
  PERCENT = 'percent',
  PERMILLE = 'permille'
}

export function RateScaleApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: RateScale,
    enumName: 'RateScaleEnum',
    example: RateScale.PERCENT
  })
}
