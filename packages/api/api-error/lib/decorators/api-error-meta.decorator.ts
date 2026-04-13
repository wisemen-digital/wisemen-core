import { ApiProperty } from '@nestjs/swagger'

export function ApiErrorMeta (): PropertyDecorator {
  return ApiProperty({
    required: true,
    description: 'a meta object containing non-standard meta-information about the error'
  })
}
