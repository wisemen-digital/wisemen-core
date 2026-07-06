import { HeaderRateLimitConfig } from '../rate-limit-config.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export class HeaderRateStrategy implements RateLimitStrategy {
  constructor (private readonly _config: HeaderRateLimitConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    if (row?.tokens == null || row.resetAt == null) {
      return false
    }

    return row.tokens <= 0 && now < row.resetAt
  }
}
