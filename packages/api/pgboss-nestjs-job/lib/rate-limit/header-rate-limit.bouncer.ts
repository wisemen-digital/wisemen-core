import { parseRateLimitHeaders, parseRetryAfterSeconds } from './parse-rate-limit-headers.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'
import { HeaderRateLimitOptions } from './rate-limit-options.js'

/**
 * Header mode: mirror the API's own budget from its `X-RateLimit-*` headers, blocking
 * while it reports nothing left. A throttled response forces a cooldown on top.
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

  protected override get throttleStatuses (): readonly number[] {
    return this.options.throttleStatuses ?? super.throttleStatuses
  }

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

    if (this.isThrottleResponse(status, headers)) {
      await this.blockFor(
        parseRetryAfterSeconds(headers, this.options.retryAfterHeader) ??
          RateLimitBouncer.DEFAULT_COOLDOWN_SECONDS
      )
    }
  }
}
