import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export function TimestampApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: [
      { type: 'string', format: 'date-time' },
      { type: 'string', enum: ['infinity'] },
      { type: 'string', enum: ['-infinity'] }
    ]
  })
}
