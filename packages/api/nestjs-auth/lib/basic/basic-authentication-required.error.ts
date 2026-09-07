import { ApiErrorCode, UnauthorizedApiError } from '@wisemen/api-error'

export class BasicAuthenticationRequiredError extends UnauthorizedApiError{
  @ApiErrorCode('basic-auth-required')
  code = 'basic-auth-required'

  meta: never

  constructor() {
    super('Authentication required')
  }
}