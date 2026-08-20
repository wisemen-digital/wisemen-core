/** Options shared by every rate-limit mode. */
export interface RateLimitOptions {
  /**
   * Statuses meaning "you are being throttled"; replaces the `[429]` default.
   * For what a status cannot express, override `RateLimitBouncer.isThrottleResponse`.
   */
  throttleStatuses?: number[]
}

/** Options for {@link StaticRateLimitBouncer}: a fixed budget per rolling window. */
export interface StaticRateLimitOptions extends RateLimitOptions {
  /** Maximum number of requests allowed per window. */
  limit: number
  /** Length of the window in seconds. */
  windowSeconds: number
}

/** Options for {@link HeaderRateLimitBouncer}: header names, defaulting to the `X-RateLimit-*` convention. */
export interface HeaderRateLimitOptions extends RateLimitOptions {
  remainingHeader?: string
  resetHeader?: string
  retryAfterHeader?: string
}

/** Options for {@link FailureBackoffBouncer}: the limit is unknown, so back off after a failure. */
export interface FailureBackoffOptions extends RateLimitOptions {
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
