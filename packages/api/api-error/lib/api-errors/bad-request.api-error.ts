import { HttpStatus } from '@nestjs/common'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export abstract class BadRequestApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.BAD_REQUEST)
  status = '400'

  constructor (detail: string) {
    super(detail)
  }
}
