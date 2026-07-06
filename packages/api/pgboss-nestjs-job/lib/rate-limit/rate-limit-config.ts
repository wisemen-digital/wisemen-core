export interface StaticRateLimitConfig {
  source: 'static'
  /** Maximum number of requests allowed per window. */
  limit: number
  /** Length of the window in seconds. */
  windowSeconds: number
}

export interface HeaderRateLimitConfig {
  source: 'headers'
  remainingHeader?: string
  resetHeader?: string
  retryAfterHeader?: string
}

export interface FailureBackoffConfig {
  source: 'failure'
  backoffSeconds: number
  maxBackoffSeconds?: number
}

export type RateLimitConfig =
  | StaticRateLimitConfig
  | HeaderRateLimitConfig
  | FailureBackoffConfig

/**
 * Central declaration of every rate limit, keyed by its group id. A job opts
 * into a limit by tagging itself with the matching key
 * (`super(data, { rateLimited: key })`); the worker resolves the strategy from
 * this map. The config belongs to the downstream API, so it lives here once —
 * not repeated on each job class.
 */
export type RateLimitConfigMap = Record<string, RateLimitConfig>

/** What execution observed after calling the API. */
export interface RateLimitSignal {
  status?: number
  retryAfterSeconds?: number
  remaining?: number
  resetAt?: Date
  throttled?: boolean
}
