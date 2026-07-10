/** Options for {@link StaticRateLimitBouncer}: a fixed budget per rolling window. */
export interface StaticRateLimitOptions {
  /** Maximum number of requests allowed per window. */
  limit: number
  /** Length of the window in seconds. */
  windowSeconds: number
}

/**
 * Options for {@link HeaderRateLimitBouncer}: the downstream API reports its own
 * budget via response headers. All fields are optional and default to the common
 * `X-RateLimit-*` / `Retry-After` conventions.
 */
export interface HeaderRateLimitOptions {
  remainingHeader?: string
  resetHeader?: string
  retryAfterHeader?: string
}

/**
 * Options for {@link FailureBackoffBouncer}: we know nothing up front and only
 * learn the limit by getting a 429 / transport error, then back off.
 */
export interface FailureBackoffOptions {
  backoffSeconds: number
  maxBackoffSeconds?: number
}

/** What execution observed after calling the API. */
export interface RateLimitSignal {
  status?: number
  retryAfterSeconds?: number
  remaining?: number
  resetAt?: Date
  throttled?: boolean
}
