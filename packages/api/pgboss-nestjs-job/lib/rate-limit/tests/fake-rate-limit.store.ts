import { HeaderState } from '../redis-rate-limit.store.js'

/**
 * In-memory stand-in for {@link RedisRateLimitStore}. Set `unavailable = true` to
 * simulate Redis being down: reads return the fail-open fallback, writes are dropped.
 */
export class FakeRateLimitStore {
  readonly counts = new Map<string, number>()
  readonly headerStates = new Map<string, HeaderState>()
  readonly blocked = new Map<string, Date>()
  unavailable = false

  incrementWindow (key: string): Promise<number | null> {
    if (this.unavailable) {
      return Promise.resolve(null)
    }

    const next = (this.counts.get(key) ?? 0) + 1
    this.counts.set(key, next)

    return Promise.resolve(next)
  }

  getCount (key: string): Promise<number> {
    return Promise.resolve(this.unavailable ? 0 : (this.counts.get(key) ?? 0))
  }

  setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void> {
    if (!this.unavailable) {
      this.headerStates.set(key, { remaining, resetAt })
    }

    return Promise.resolve()
  }

  getHeaderState (key: string): Promise<HeaderState | null> {
    return Promise.resolve(this.unavailable ? null : (this.headerStates.get(key) ?? null))
  }

  setBlockedUntil (key: string, until: Date): Promise<void> {
    if (!this.unavailable) {
      this.blocked.set(key, until)
    }

    return Promise.resolve()
  }

  getBlockedUntil (key: string): Promise<Date | null> {
    return Promise.resolve(this.unavailable ? null : (this.blocked.get(key) ?? null))
  }
}

/** Attach a fake store to a bouncer (bypasses Nest property injection in tests). */
export function withStore<T> (bouncer: T, store: FakeRateLimitStore): T {
  ;(bouncer as unknown as { store: FakeRateLimitStore }).store = store

  return bouncer
}
