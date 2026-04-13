import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export function TimestampApiProperty (
  options?: Omit<ApiPropertyOptions, 'type' | 'format' | 'oneOf' | 'enum'>
): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: [
      { type: 'string', format: 'date-time' },
      { enum: ['infinity'] },
      { enum: ['-infinity'] }
    ]
  } as ApiPropertyOptions)
}
