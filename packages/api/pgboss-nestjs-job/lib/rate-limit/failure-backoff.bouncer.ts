import { nextBackoff } from './backoff.js'
import { parseRetryAfterSeconds } from './parse-rate-limit-headers.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'
import { FailureBackoffOptions, RateLimitSignal } from './rate-limit-options.js'

/**
 * Failure-backoff mode: nothing is known up front, so there is no proactive gate — the
 * queue flows until a throttle or transport error sets a backoff cooldown.
 *
 * ```ts
 * @Bouncer(QueueName.FLAKY)
 * export class FlakyBouncer extends FailureBackoffBouncer {
 *   protected readonly options = { backoffSeconds: 30, maxBackoffSeconds: 300 }
 * }
 * ```
 */
export abstract class FailureBackoffBouncer extends RateLimitBouncer {
  protected abstract readonly options: FailureBackoffOptions

  protected override get throttleStatuses (): readonly number[] {
    return this.options.throttleStatuses ?? super.throttleStatuses
  }

  protected checkMode (): Promise<boolean> {
    // No proactive signal; gated purely by the universal blockedUntil cooldown.
    return Promise.resolve(true)
  }

  override async onResponse (
    status: number,
    headers: Record<string, string | undefined>
  ): Promise<void> {
    if (!this.isThrottleResponse(status, headers)) {
      return
    }

    const signal: RateLimitSignal = { status, throttled: true }
    const retryAfter = parseRetryAfterSeconds(headers)

    if (retryAfter !== undefined) {
      signal.retryAfterSeconds = retryAfter
    }

    await this.store.setBlockedUntil(this.queueKey, nextBackoff(this.options, signal, new Date()))
  }

  override async onError (): Promise<void> {
    await this.store.setBlockedUntil(
      this.queueKey,
      nextBackoff(this.options, { throttled: true }, new Date())
    )
  }
}
