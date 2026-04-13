import { ServiceUnavailableApiError, ApiErrorCode } from '@wisemen/api-error'

export class TwilioUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('twilio_unavailable')
  readonly code = 'twilio_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
