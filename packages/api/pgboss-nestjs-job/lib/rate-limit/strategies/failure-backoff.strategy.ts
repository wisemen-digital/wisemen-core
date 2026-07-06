import { FailureBackoffConfig, RateLimitSignal } from '../rate-limit-config.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export function nextBackoff (
  config: FailureBackoffConfig,
  signal: RateLimitSignal,
  now: Date
): Date {
  const requested = signal.retryAfterSeconds ?? config.backoffSeconds
  const capped = config.maxBackoffSeconds != null
    ? Math.min(requested, config.maxBackoffSeconds)
    : requested

  return new Date(now.getTime() + capped * 1000)
}

export class FailureBackoffStrategy implements RateLimitStrategy {
  constructor (private readonly _config: FailureBackoffConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    return row?.blockedUntil != null && now < row.blockedUntil
  }
}
