import { HttpStatus } from '@nestjs/common'
import { ApiErrorCode } from '../decorators/api-error-code.decorator.js'
import { ApiErrorStatus } from '../decorators/api-error-status.decorator.js'
import { ApiError } from './api-error.js'

export class ServiceUnavailableApiError extends ApiError {
  @ApiErrorStatus(HttpStatus.SERVICE_UNAVAILABLE)
  status = '503'

  @ApiErrorCode('service_unavailable_error')
  code = 'service_unavailable_error'

  meta: never

  constructor (detail?: string) {
    super(detail ?? 'The server is currently unable to handle the request due to a temporary overload or scheduled maintenance.')
  }
}
