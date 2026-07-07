import { HeaderRateLimitConfig, RateLimitSignal } from './rate-limit-config.js'

/** Parse a header value to a finite number, or undefined if absent/blank/non-numeric. */
function toFiniteNumber (raw: string | undefined): number | undefined {
  if (raw === undefined || raw.trim() === '') {
    return undefined
  }

  const value = Number(raw)

  return Number.isFinite(value) ? value : undefined
}

export function parseRateLimitHeaders (
  headers: Record<string, string | undefined>,
  config: HeaderRateLimitConfig
): RateLimitSignal {
  const remainingKey = (config.remainingHeader ?? 'x-ratelimit-remaining').toLowerCase()
  const resetKey = (config.resetHeader ?? 'x-ratelimit-reset').toLowerCase()
  const retryAfterKey = (config.retryAfterHeader ?? 'retry-after').toLowerCase()

  const signal: RateLimitSignal = {}

  const remaining = toFiniteNumber(headers[remainingKey])
  if (remaining !== undefined) {
    signal.remaining = remaining
  }

  const reset = toFiniteNumber(headers[resetKey])
  if (reset !== undefined) {
    // Epoch seconds per the common convention.
    signal.resetAt = new Date(reset * 1000)
  }

  const retryAfter = toFiniteNumber(headers[retryAfterKey])
  if (retryAfter !== undefined) {
    signal.retryAfterSeconds = retryAfter
  }

  return signal
}
