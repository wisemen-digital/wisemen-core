import { ApiErrorCode, UnauthorizedApiError } from '@wisemen/api-error'

export class InvalidOidcSubjectClaimError extends UnauthorizedApiError {
  @ApiErrorCode('invalid_oidc_subject_claim')
  readonly code = 'invalid_oidc_subject_claim'

  readonly meta: never

  constructor () {
    super('Unauthorized: OIDC token has an invalid subject claim')
  }
}
