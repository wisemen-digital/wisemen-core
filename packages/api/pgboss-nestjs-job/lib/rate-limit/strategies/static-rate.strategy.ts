import { StaticRateLimitConfig } from '../rate-limit-config.js'
import { refill } from '../refill.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export class StaticRateStrategy implements RateLimitStrategy {
  constructor (private readonly config: StaticRateLimitConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    const bucket = row?.windowStartAt != null && row.tokens != null
      ? { tokens: row.tokens, windowStartAt: row.windowStartAt }
      : null

    const refilled = refill(bucket, this.config, now)

    return refilled.tokens <= 0
  }
}
