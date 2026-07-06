import { RateLimitBucketRow } from './rate-limit.strategy.js'

export abstract class RateLimitStore {
  abstract ensureSchema (): Promise<void>
  abstract getMany (keys: string[]): Promise<RateLimitBucketRow[]>
  /** Atomically refill+decrement one token. Returns true if a token was granted. */
  abstract tryConsumeToken (key: string, limit: number, windowSeconds: number): Promise<boolean>
  abstract setBlockedUntil (key: string, until: Date): Promise<void>
  abstract setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void>
}
