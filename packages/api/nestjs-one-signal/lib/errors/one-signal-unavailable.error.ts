import { ApiErrorCode } from '@wisemen/api-error'
import { ServiceUnavailableApiError } from '@wisemen/api-error'

export class OneSignalUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('one_signal_unavailable')
  readonly code = 'one_signal_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
