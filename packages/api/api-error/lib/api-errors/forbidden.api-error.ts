import { HttpStatus } from '@nestjs/common'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export abstract class ForbiddenApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.FORBIDDEN)
  status = '403'

  constructor (detail: string) {
    super(detail)
  }
}
