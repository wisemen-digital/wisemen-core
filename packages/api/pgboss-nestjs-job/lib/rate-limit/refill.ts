import { StaticRateLimitConfig } from './rate-limit-config.js'

export interface Bucket {
  tokens: number
  windowStartAt: Date
}

export function refill (
  bucket: Bucket | null,
  config: StaticRateLimitConfig,
  now: Date
): Bucket {
  if (bucket === null) {
    return { tokens: config.limit, windowStartAt: now }
  }

  const elapsedMs = now.getTime() - bucket.windowStartAt.getTime()

  if (elapsedMs >= config.windowSeconds * 1000) {
    return { tokens: config.limit, windowStartAt: now }
  }

  return bucket
}
