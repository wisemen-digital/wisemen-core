import { ApiErrorCode } from '@wisemen/api-error'
import { ServiceUnavailableApiError } from '@wisemen/api-error'

export class NatsUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('nats_unavailable')
  readonly code = 'nats_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
