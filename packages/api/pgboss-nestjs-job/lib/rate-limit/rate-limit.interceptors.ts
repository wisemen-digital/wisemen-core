import type { FetchClient } from '@wisemen/node-fetch'
import { RateLimitSignal } from './rate-limit-options.js'
import { RateLimitError } from './rate-limit.error.js'
import { RateLimitBouncer } from './rate-limit.bouncer.js'

/**
 * Register rate-limit accounting on a `@wisemen/node-fetch` client, feeding the
 * queue's `bouncer`. A client talks to exactly one rate-limited API, so its
 * bouncer is known at wiring time and bound directly — no async context needed.
 * `onRequest` runs before each request, `onResponse` on each response, `onError`
 * on a transport failure. A 429 records the cooldown (via `onResponse`) and then
 * throws {@link RateLimitError} so the job fails and is retried after the
 * cooldown clears.
 */
export function useRateLimiting (client: FetchClient, bouncer: RateLimitBouncer): void {
  client.interceptors.request.use(async (request) => {
    await bouncer.onRequest()

    return request
  })

  client.interceptors.response.use(async (response) => {
    const headers = Object.fromEntries(response.headers.entries()) as Record<string, string | undefined>

    await bouncer.onResponse(response.status, headers)

    if (response.status === 429) {
      const signal: RateLimitSignal = { status: 429, throttled: true }
      const retryAfter = headers['retry-after']

      if (retryAfter !== undefined) {
        signal.retryAfterSeconds = Number(retryAfter)
      }

      throw new RateLimitError(signal)
    }

    return response
  })

  client.interceptors.error.use(async (error) => {
    // A 429 throws RateLimitError from the response interceptor; if the client
    // ever routed that here, it must not double-count as a transport error.
    if (!(error instanceof RateLimitError)) {
      await bouncer.onError()
    }

    return error
  })
}
