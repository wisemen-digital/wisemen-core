import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export function WiseDateApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    oneOf: [
      { type: 'string', format: 'date' },
      { enum: ['infinity'] },
      { enum: ['-infinity'] }
    ]
  })
}
