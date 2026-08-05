import { ApiErrorCode, ServiceUnavailableApiError } from '@wisemen/api-error'

export class MailUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('mail_unavailable')
  readonly code = 'mail_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
