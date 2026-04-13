import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export enum DatePeriod {
  PAST = 'past',
  ACTIVE = 'active',
  FUTURE = 'future'
}

export function DatePeriodApiProperty (
  options?: ApiPropertyOptions
): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: DatePeriod,
    enumName: 'DatePeriod'
  })
}
