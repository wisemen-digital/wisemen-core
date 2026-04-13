import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export function ApiErrorStatus (status: HttpStatus): PropertyDecorator {
  return ApiProperty({
    required: true,
    enum: [String(status)],
    example: status.toString()
  })
}
