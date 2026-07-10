import { parseRateLimitHeaders, parseRetryAfterSeconds } from './parse-rate-limit-headers.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'
import { HeaderRateLimitOptions } from './rate-limit-options.js'

/**
 * Header mode: mirror the API's own budget from response headers
 * (`X-RateLimit-Remaining` / `-Reset`, `Retry-After`). Blocks while the reported
 * remaining is exhausted and the reset is still in the future. A 429 forces a
 * cooldown on top.
 *
 * ```ts
 * @Bouncer(QueueName.CUOPT)
 * export class CuoptBouncer extends HeaderRateLimitBouncer {
 *   protected readonly options = {}
 * }
 * ```
 */
export abstract class HeaderRateLimitBouncer extends RateLimitBouncer {
  protected abstract readonly options: HeaderRateLimitOptions

  protected async checkMode (now: Date): Promise<boolean> {
    const state = await this.store.getHeaderState(this.queueKey)

    if (state == null) {
      return true
    }

    if (state.remaining > 0) {
      return true
    }

    // Exhausted: blocked until the API-provided reset passes.
    return state.resetAt != null && now >= state.resetAt
  }

  override async onResponse (
    status: number,
    headers: Record<string, string | undefined>
  ): Promise<void> {
    const signal = parseRateLimitHeaders(headers, this.options)

    if (signal.remaining !== undefined) {
      await this.store.setHeaderState(this.queueKey, signal.remaining, signal.resetAt ?? null)
    }

    if (status === 429) {
      await this.blockFor(
        parseRetryAfterSeconds(headers, this.options.retryAfterHeader) ??
          RateLimitBouncer.DEFAULT_COOLDOWN_SECONDS
      )
    }
  }
}
