import { Inject } from '@nestjs/common'
import { PgbossBouncer } from '../worker/pgboss-bouncer.js'
import { getPgbossBouncerQueueName } from '../worker/pgboss-bouncer.decorator.js'
import { RateLimitOptions, StoreUnavailablePolicy } from './rate-limit-options.js'
import { RedisRateLimitStore } from './redis-rate-limit.store.js'

/**
 * Base for the rate-limit bouncers: `canProceed()` gates on Redis state, the
 * transport hooks write it. Keyed by the `@Bouncer(name)` queue. The store is
 * property-injected so subclasses need no constructor; keep them singleton-scoped.
 */
export abstract class RateLimitBouncer extends PgbossBouncer {
  /** Cooldown for a throttle with no `Retry-After`, for modes lacking their own backoff. */
  protected static readonly DEFAULT_COOLDOWN_SECONDS = 60
  /** Statuses treated as throttling when a bouncer declares none of its own. */
  protected static readonly DEFAULT_THROTTLE_STATUSES: readonly number[] = [429]

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

  /** Shared options, exposed by each mode so this base can read them without knowing the mode. */
  protected abstract get sharedOptions (): RateLimitOptions

  /**
   * Whether work flows when Redis cannot answer. Rate limiting fails open by default;
   * `onStoreUnavailable: 'block'` trades a stalled queue for never flooding the API.
   */
  protected get allowWhenStoreUnavailable (): boolean {
    const policy = this.sharedOptions.onStoreUnavailable ?? StoreUnavailablePolicy.ALLOW

    return policy === StoreUnavailablePolicy.ALLOW
  }

  /** Fetch gate: the shared `blockedUntil` cooldown blocks every mode, then {@link checkMode} gates. */
  async canProceed (): Promise<boolean> {
    // Checked up front: with Redis down every read below fails open, so the policy
    // decides here rather than in each mode.
    if (!this.store.isAvailable()) {
      return this.allowWhenStoreUnavailable
    }

    const now = new Date()
    const blockedUntil = await this.store.getBlockedUntil(this.queueKey)

    if (blockedUntil != null && now < blockedUntil) {
      return false
    }

    return this.checkMode(now)
  }

  /**
   * Is this a throttle? The one place every mode and {@link useRateLimiting} asks.
   * No body by design — the interceptor must not consume the response stream.
   */
  isThrottleResponse (status: number, _headers: Record<string, string | undefined>): boolean {
    const statuses = this.sharedOptions.throttleStatuses ?? RateLimitBouncer.DEFAULT_THROTTLE_STATUSES

    return statuses.includes(status)
  }

  /** Per-mode proactive gate, evaluated only when not on a throttle cooldown. */
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
