import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

export function PlainTimeApiProperty (
  options?: Omit<ApiPropertyOptions, 'type' | 'format'>
): PropertyDecorator {
  return ApiProperty({ ...options, type: 'string', format: 'time' } as ApiPropertyOptions)
}
