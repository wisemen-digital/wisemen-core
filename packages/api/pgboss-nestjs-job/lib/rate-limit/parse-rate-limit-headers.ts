import { HeaderRateLimitConfig, RateLimitSignal } from './rate-limit-config.js'

export function parseRateLimitHeaders (
  headers: Record<string, string | undefined>,
  config: HeaderRateLimitConfig
): RateLimitSignal {
  const remainingKey = (config.remainingHeader ?? 'x-ratelimit-remaining').toLowerCase()
  const resetKey = (config.resetHeader ?? 'x-ratelimit-reset').toLowerCase()
  const retryAfterKey = (config.retryAfterHeader ?? 'retry-after').toLowerCase()

  const signal: RateLimitSignal = {}

  const remaining = headers[remainingKey]
  if (remaining !== undefined) {
    signal.remaining = Number(remaining)
  }

  const reset = headers[resetKey]
  if (reset !== undefined) {
    // Epoch seconds per the common convention.
    signal.resetAt = new Date(Number(reset) * 1000)
  }

  const retryAfter = headers[retryAfterKey]
  if (retryAfter !== undefined) {
    signal.retryAfterSeconds = Number(retryAfter)
  }

  return signal
}
