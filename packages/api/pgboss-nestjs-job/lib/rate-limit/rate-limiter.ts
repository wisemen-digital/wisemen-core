import { Injectable, Logger } from '@nestjs/common'
import { RateLimitConfig, RateLimitSignal } from './rate-limit-config.js'
import { parseRateLimitHeaders } from './parse-rate-limit-headers.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { RateLimitStore } from './rate-limit.store.js'
import { nextBackoff } from './strategies/failure-backoff.strategy.js'

/** Cooldown applied to a 429 with no `Retry-After`, for modes without their own backoff config. */
const DEFAULT_THROTTLE_COOLDOWN_SECONDS = 60

@Injectable()
export class PgbossRateLimiter {
  private readonly logger = new Logger(PgbossRateLimiter.name)

  constructor (
    private readonly registry: PgbossRateLimitRegistry,
    private readonly store: RateLimitStore
  ) {}

  async onModuleInit (): Promise<void> {
    await this.store.ensureSchema()
  }

  /** Fetch-gate: which registered keys are blocked right now. Fail-open on error. */
  async blockedKeys (): Promise<string[]> {
    const keys = this.registry.getAllKeys()

    if (keys.length === 0) {
      return []
    }

    try {
      const rows = await this.store.getMany(keys)
      const byKey = new Map(rows.map(r => [r.key, r]))
      const now = new Date()
      const blocked: string[] = []

      for (const key of keys) {
        const row = byKey.get(key) ?? null
        const strategy = this.registry.getStrategy(key)
        // A `blockedUntil` cooldown (set by a 429) gates every mode; the
        // per-mode strategy handles proactive gating (token bucket / headers).
        const onCooldown = row?.blockedUntil != null && now < row.blockedUntil
        if (onCooldown || strategy?.isBlocked(row, now) === true) {
          blocked.push(key)
        }
      }

      return blocked
    } catch (error) {
      this.logger.error('blockedKeys failed; failing open', error as Error)
      return []
    }
  }

  /**
   * Transport hook — a request is about to be sent. Static mode counts one
   * attempt against the shared budget (per-request, so retries and failed
   * requests are counted too). Header/failure modes learn from the response, so
   * this is a no-op for them.
   */
  async onRequest (key: string): Promise<void> {
    const config = this.registry.getConfig(key)
    if (config?.source !== 'static') {
      return
    }

    await this.store.tryConsumeToken(key, config.limit, config.windowSeconds)
  }

  /**
   * Transport hook — a response arrived. Header mode records the API's reported
   * remaining/reset (proactive gating). A 429 blocks the key for *every* mode so
   * its jobs wait before retrying (failure mode uses its configured backoff;
   * static/headers use `Retry-After` or a default cooldown).
   */
  async onResponse (key: string, status: number, headers: Record<string, string | undefined>): Promise<void> {
    const config = this.registry.getConfig(key)
    if (config === undefined) {
      return
    }

    if (config.source === 'headers') {
      const signal = parseRateLimitHeaders(headers, config)
      if (signal.remaining !== undefined) {
        await this.store.setHeaderState(key, signal.remaining, signal.resetAt ?? null)
      }
    }

    if (status === 429) {
      await this.store.setBlockedUntil(key, this.throttleUntil(config, headers))
    }
  }

  /** When a 429 clears: `Retry-After` if given; failure mode falls back to its backoff, others to the default. */
  private throttleUntil (config: RateLimitConfig, headers: Record<string, string | undefined>): Date {
    const now = new Date()
    const retryAfter = Number(headers['retry-after'])
    const hasRetryAfter = Number.isFinite(retryAfter) && retryAfter > 0

    if (config.source === 'failure') {
      const signal: RateLimitSignal = { throttled: true, status: 429 }
      if (hasRetryAfter) {
        signal.retryAfterSeconds = retryAfter
      }

      return nextBackoff(config, signal, now)
    }

    const seconds = hasRetryAfter ? retryAfter : DEFAULT_THROTTLE_COOLDOWN_SECONDS

    return new Date(now.getTime() + seconds * 1000)
  }

  /**
   * Transport hook — the request threw (network error / abort). Failure mode
   * treats that as a throttle and backs off; other modes ignore it.
   */
  async onError (key: string): Promise<void> {
    const config = this.registry.getConfig(key)
    if (config?.source !== 'failure') {
      return
    }

    await this.store.setBlockedUntil(key, nextBackoff(config, { throttled: true }, new Date()))
  }
}
