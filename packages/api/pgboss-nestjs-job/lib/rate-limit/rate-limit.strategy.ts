export interface RateLimitBucketRow {
  key: string
  tokens: number | null
  windowStartAt: Date | null
  resetAt: Date | null
  blockedUntil: Date | null
}

export interface RateLimitStrategy {
  /** Fetch-gate read: is this key blocked right now, given its stored row? */
  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean
}
