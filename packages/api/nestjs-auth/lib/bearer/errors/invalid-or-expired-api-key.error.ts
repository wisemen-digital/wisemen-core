import { ApiErrorCode, UnauthorizedApiError } from '@wisemen/api-error'

export class InvalidOrExpiredApiKeyError extends UnauthorizedApiError {
  @ApiErrorCode('invalid_or_expired_api_key')
  readonly code = 'invalid_or_expired_api_key'

  readonly meta: never

  constructor () {
    super('Unauthorized: Invalid or expired api key')
  }
}
