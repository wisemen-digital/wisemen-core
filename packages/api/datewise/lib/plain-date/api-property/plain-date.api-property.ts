import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export function PlainDateApiProperty (
  options?: Omit<ApiPropertyOptions, 'oneOf' | 'type' | 'format' | 'enum'>
): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: [
      { type: 'string', format: 'date' },
      { enum: ['infinity'] },
      { enum: ['-infinity'] }
    ]
  } as ApiPropertyOptions)
}
