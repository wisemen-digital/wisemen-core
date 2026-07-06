import { AsyncLocalStorage } from 'async_hooks'

export interface RateLimitContext {
  key: string
}

/**
 * Carries the current job's rate-limit key across the handler's async call
 * stack so a shared transport interceptor can attribute each HTTP request to
 * the right limit without threading the key through handler signatures. The
 * worker thread sets it around handler execution; interceptors read it.
 */
export const rateLimitStorage = new AsyncLocalStorage<RateLimitContext>()

/** The rate-limit key of the job currently executing, if any. */
export function currentRateLimitKey (): string | undefined {
  return rateLimitStorage.getStore()?.key
}
