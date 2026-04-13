import { HttpStatus } from '@nestjs/common'
import { ApiErrorCode } from '../decorators/api-error-code.decorator.js'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export class InternalServerApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  status = '500'

  @ApiErrorCode('internal_server_error')
  code = 'internal_server_error'

  meta: never

  constructor (detail?: string) {
    super(detail ?? 'The server was unable to complete your request. Please try again later.')
  }
}
