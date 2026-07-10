import { Inject } from '@nestjs/common'
import { PgbossBouncer } from '../worker/pgboss-bouncer.js'
import { getPgbossBouncerQueueName } from '../worker/pgboss-bouncer.decorator.js'
import { RedisRateLimitStore } from './redis-rate-limit.store.js'

/**
 * Base for the rate-limit bouncers. A rate-limited queue's bouncer *is* its
 * limiter: `canProceed()` (the fetch gate) reads Redis; the transport hooks
 * (`onRequest`/`onResponse`/`onError`, driven by {@link useRateLimiting}) write
 * to Redis. State is keyed by the queue name from the `@Bouncer(name)` decorator.
 *
 * The store is **property-injected** on this base so concrete subclasses stay
 * boilerplate-free (a subclass with no constructor would otherwise emit no
 * constructor-injection metadata). Keep concrete bouncers default-scoped
 * (singleton): a static dependency tree lets `PgbossBouncerRegistry` reuse one
 * instance instead of resolving a fresh one per request.
 */
export abstract class RateLimitBouncer extends PgbossBouncer {
  /** Fallback cooldown for a 429 with no `Retry-After`, for modes without their own backoff. */
  protected static readonly DEFAULT_COOLDOWN_SECONDS = 60

  @Inject(RedisRateLimitStore)
  protected readonly store!: RedisRateLimitStore

  private cachedKey?: string

  /** The rate-limit key for this queue, read once from the `@Bouncer` metadata. */
  protected get queueKey (): string {
    this.cachedKey ??= getPgbossBouncerQueueName(
      this.constructor as Parameters<typeof getPgbossBouncerQueueName>[0]
    )

    return this.cachedKey
  }

  /**
   * Fetch gate. A `blockedUntil` cooldown (set by a 429) blocks every mode; the
   * per-mode {@link checkMode} handles proactive gating.
   */
  async canProceed (): Promise<boolean> {
    const now = new Date()
    const blockedUntil = await this.store.getBlockedUntil(this.queueKey)

    if (blockedUntil != null && now < blockedUntil) {
      return false
    }

    return this.checkMode(now)
  }

  /** Per-mode proactive gate, evaluated only when not on a 429 cooldown. */
  protected abstract checkMode (now: Date): Promise<boolean>

  /** Block this queue for `seconds` from `now` (no-op when non-positive). */
  protected async blockFor (seconds: number, now = new Date()): Promise<void> {
    if (seconds > 0) {
      await this.store.setBlockedUntil(this.queueKey, new Date(now.getTime() + seconds * 1000))
    }
  }

  /** Called before each outbound request on this queue's instrumented client. */
  onRequest (): Promise<void> {
    return Promise.resolve()
  }

  /** Called with each response's status + headers. */
  onResponse (_status: number, _headers: Record<string, string | undefined>): Promise<void> {
    return Promise.resolve()
  }

  /** Called on a transport error (network failure / abort). */
  onError (): Promise<void> {
    return Promise.resolve()
  }
}
