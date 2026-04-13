import { HttpStatus } from '@nestjs/common'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export abstract class NotFoundApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.NOT_FOUND)
  status = '404'

  constructor (detail: string) {
    super(detail)
  }
}
