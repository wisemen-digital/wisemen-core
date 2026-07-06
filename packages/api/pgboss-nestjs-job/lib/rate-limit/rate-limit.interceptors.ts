import type { FetchClient } from '@wisemen/node-fetch'
import { RateLimitSignal } from './rate-limit-config.js'
import { RateLimitError } from './rate-limit.error.js'
import { currentRateLimitKey } from './rate-limit.context.js'
import type { PgbossRateLimiter } from './rate-limiter.js'

type LimiterHooks = Pick<PgbossRateLimiter, 'onRequest' | 'onResponse' | 'onError'>

/**
 * `@wisemen/node-fetch` interceptors that do rate-limit accounting for the job
 * currently executing (resolved from async context — see `rate-limit.context`).
 * Register them on a client with {@link useRateLimiting}. Requests made outside
 * a rate-limited job are left untouched.
 */
export interface RateLimitInterceptors {
  request: (req: Request) => Promise<Request>
  response: (res: Response, req?: Request) => Promise<Response>
  error: (err: unknown, res?: Response, req?: Request) => Promise<unknown>
}

export function createRateLimitInterceptors (limiter: LimiterHooks): RateLimitInterceptors {
  return {
    request: async (req) => {
      const key = currentRateLimitKey()
      if (key != null) {
        await limiter.onRequest(key)
      }

      return req
    },
    response: async (res) => {
      const key = currentRateLimitKey()
      if (key != null) {
        const headers = Object.fromEntries(res.headers.entries()) as Record<string, string | undefined>
        await limiter.onResponse(key, res.status, headers)

        if (res.status === 429) {
          const signal: RateLimitSignal = { status: 429, throttled: true }
          if (headers['retry-after'] !== undefined) {
            signal.retryAfterSeconds = Number(headers['retry-after'])
          }

          throw new RateLimitError(signal)
        }
      }

      return res
    },
    error: async (err) => {
      const key = currentRateLimitKey()
      // The 429 branch above throws a RateLimitError; if the client routes that
      // into the error channel, it must not double-count as a transport error.
      if (key != null && !(err instanceof RateLimitError)) {
        await limiter.onError(key)
      }

      return err
    }
  }
}

/** Register rate-limit accounting on a `@wisemen/node-fetch` client. */
export function useRateLimiting (client: FetchClient, limiter: LimiterHooks): void {
  const { request, response, error } = createRateLimitInterceptors(limiter)

  client.interceptors.request.use(request)
  client.interceptors.response.use(response)
  client.interceptors.error.use(error)
}
