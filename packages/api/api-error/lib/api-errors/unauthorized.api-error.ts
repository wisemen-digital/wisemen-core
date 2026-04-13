import { HttpStatus } from '@nestjs/common'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export abstract class UnauthorizedApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.UNAUTHORIZED)
  status = '401'

  constructor (detail: string) {
    super(detail)
  }
}
