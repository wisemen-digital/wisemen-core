import { ApiErrorCode } from '@wisemen/api-error'
import { UnauthorizedApiError } from '@wisemen/api-error'

export class NoAuthorizationHeaderError extends UnauthorizedApiError {
  @ApiErrorCode('no_authorization_header')
  readonly code = 'no_authorization_header'

  readonly meta: never

  constructor () {
    super('Unauthorized: No authorization header found')
  }
}
