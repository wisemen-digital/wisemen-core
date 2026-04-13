import { HttpStatus } from '@nestjs/common'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export abstract class ConflictApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.CONFLICT)
  status = '409'

  constructor (detail: string) {
    super(detail)
  }
}
