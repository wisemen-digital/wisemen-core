import { Injectable, Logger } from '@nestjs/common'
import { RateLimitSignal } from './rate-limit-config.js'
import { parseRateLimitHeaders } from './parse-rate-limit-headers.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { RateLimitStore } from './rate-limit.store.js'
import { nextBackoff } from './strategies/failure-backoff.strategy.js'

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
        const strategy = this.registry.getStrategy(key)
        if (strategy?.isBlocked(byKey.get(key) ?? null, now) === true) {
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
   * remaining/reset; failure mode blocks on a 429 (honoring `Retry-After`).
   * Static mode already counted at request time, so it is a no-op.
   */
  async onResponse (key: string, status: number, headers: Record<string, string | undefined>): Promise<void> {
    const config = this.registry.getConfig(key)

    if (config?.source === 'headers') {
      const signal = parseRateLimitHeaders(headers, config)
      if (signal.remaining !== undefined) {
        await this.store.setHeaderState(key, signal.remaining, signal.resetAt ?? null)
      }

      return
    }

    if (config?.source === 'failure' && status === 429) {
      const signal: RateLimitSignal = { throttled: true, status }
      if (headers['retry-after'] !== undefined) {
        signal.retryAfterSeconds = Number(headers['retry-after'])
      }

      await this.store.setBlockedUntil(key, nextBackoff(config, signal, new Date()))
    }
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
