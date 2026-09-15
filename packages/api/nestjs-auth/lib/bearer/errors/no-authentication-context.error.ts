import { ApiErrorCode } from '@wisemen/api-error'
import { UnauthorizedApiError } from '@wisemen/api-error'

export class NoAuthenticationContextError extends UnauthorizedApiError {
  @ApiErrorCode('no_authentication_context')
  readonly code = 'no_authentication_context'

  readonly meta: never

  constructor () {
    super('Unauthorized: No authentication context found')
  }
}
