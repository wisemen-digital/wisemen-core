import { RateLimitSignal } from './rate-limit-options.js'

/**
 * Thrown by the rate-limit response interceptor when the API returns a 429, so
 * the job fails and is retried later (after its queue's cooldown clears) rather
 * than being counted as a success.
 */
export class RateLimitError extends Error {
  constructor (readonly signal: RateLimitSignal) {
    super('Rate limit reached')
    this.name = 'RateLimitError'
  }
}
