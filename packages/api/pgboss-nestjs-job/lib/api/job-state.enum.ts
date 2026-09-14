import type { ApiPropertyOptions } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'

export enum JobState {
  CREATED = 'created',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  RETRY = 'retry',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export function JobStateApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: JobState,
    enumName: 'JobState'
  })
}
