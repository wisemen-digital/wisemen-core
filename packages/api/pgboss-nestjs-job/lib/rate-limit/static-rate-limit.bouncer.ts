import { parseRetryAfterSeconds } from './parse-rate-limit-headers.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'
import { StaticRateLimitOptions } from './rate-limit-options.js'

/**
 * Static mode: a known budget (`limit` per `windowSeconds`). Counts one token
 * per outbound request in a fixed Redis window; blocks once the count reaches
 * the limit. A 429 additionally forces a cooldown (Retry-After or default).
 *
 * ```ts
 * @Bouncer(QueueName.STRIPE)
 * export class StripeBouncer extends StaticRateLimitBouncer {
 *   protected readonly options = { limit: 100, windowSeconds: 60 }
 * }
 * ```
 */
export abstract class StaticRateLimitBouncer extends RateLimitBouncer {
  protected abstract readonly options: StaticRateLimitOptions

  protected async checkMode (): Promise<boolean> {
    const count = await this.store.getCount(this.queueKey)

    return count < this.options.limit
  }

  override async onRequest (): Promise<void> {
    await this.store.incrementWindow(this.queueKey, this.options.windowSeconds)
  }

  override async onResponse (
    status: number,
    headers: Record<string, string | undefined>
  ): Promise<void> {
    if (status === 429) {
      await this.blockFor(
        parseRetryAfterSeconds(headers) ?? RateLimitBouncer.DEFAULT_COOLDOWN_SECONDS
      )
    }
  }
}
