import { ApiErrorCode, UnauthorizedApiError } from '@wisemen/api-error'

export class InvalidOrExpiredTokenError extends UnauthorizedApiError {
  @ApiErrorCode('invalid_or_expired_token')
  readonly code = 'invalid_or_expired_token'

  readonly meta: never

  constructor () {
    super('Unauthorized: Invalid or expired token')
  }
}
