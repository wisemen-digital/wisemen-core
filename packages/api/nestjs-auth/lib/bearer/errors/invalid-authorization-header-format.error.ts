import { ApiErrorCode } from '@wisemen/api-error'
import { UnauthorizedApiError } from '@wisemen/api-error'

export class InvalidAuthorizationHeaderFormatError extends UnauthorizedApiError {
  @ApiErrorCode('invalid_authorization_header_format')
  readonly code = 'invalid_authorization_header_format'

  readonly meta: never

  constructor () {
    super('Unauthorized: Invalid authorization header format')
  }
}
