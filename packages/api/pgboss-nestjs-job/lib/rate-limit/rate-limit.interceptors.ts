import type { FetchClient } from '@wisemen/node-fetch'
import { RateLimitSignal } from './rate-limit-options.js'
import { RateLimitError } from './rate-limit.error.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'

/**
 * Register rate-limit accounting on a `@wisemen/node-fetch` client, bound to its queue's
 * `bouncer`. A throttle records the cooldown, then throws {@link RateLimitError} to retry.
 */
export function useRateLimiting (client: FetchClient, bouncer: RateLimitBouncer): void {
  client.interceptors.request.use(async (request) => {
    await bouncer.onRequest()

    return request
  })

  client.interceptors.response.use(async (response) => {
    const headers = Object.fromEntries(response.headers.entries()) as Record<string, string | undefined>

    await bouncer.onResponse(response.status, headers)

    if (bouncer.isThrottleResponse(response.status, headers)) {
      const signal: RateLimitSignal = { status: response.status, throttled: true }
      const retryAfter = headers['retry-after']

      if (retryAfter !== undefined) {
        signal.retryAfterSeconds = Number(retryAfter)
      }

      throw new RateLimitError(signal)
    }

    return response
  })

  client.interceptors.error.use(async (error) => {
    // The response interceptor already threw this; never double-count it as transport error.
    if (!(error instanceof RateLimitError)) {
      await bouncer.onError()
    }

    return error
  })
}
