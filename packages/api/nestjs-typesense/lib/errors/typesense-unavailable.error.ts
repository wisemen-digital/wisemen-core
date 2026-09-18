import { ApiErrorCode } from '@wisemen/api-error'
import { ServiceUnavailableApiError } from '@wisemen/api-error'

export class TypesenseUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('typesense_unavailable')
  readonly code = 'typesense_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
