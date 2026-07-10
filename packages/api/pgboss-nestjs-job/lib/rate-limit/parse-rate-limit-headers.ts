import { HeaderRateLimitOptions, RateLimitSignal } from './rate-limit-options.js'

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
  options: HeaderRateLimitOptions
): RateLimitSignal {
  const remainingKey = (options.remainingHeader ?? 'x-ratelimit-remaining').toLowerCase()
  const resetKey = (options.resetHeader ?? 'x-ratelimit-reset').toLowerCase()
  const retryAfterKey = (options.retryAfterHeader ?? 'retry-after').toLowerCase()

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

/** Read a `Retry-After` (seconds) value from headers, if present and positive. */
export function parseRetryAfterSeconds (
  headers: Record<string, string | undefined>,
  header = 'retry-after'
): number | undefined {
  const value = toFiniteNumber(headers[header.toLowerCase()])

  return value !== undefined && value > 0 ? value : undefined
}
