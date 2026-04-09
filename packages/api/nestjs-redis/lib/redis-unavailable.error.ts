import { ApiErrorCode } from '@wisemen/api-error'
import { ServiceUnavailableApiError } from '@wisemen/api-error'

export class RedisUnavailableError extends ServiceUnavailableApiError {
  @ApiErrorCode('redis_unavailable')
  readonly code = 'redis_unavailable'

  constructor (detail: string) {
    super(detail)
  }
}
