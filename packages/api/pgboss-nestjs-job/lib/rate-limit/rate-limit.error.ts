import { RateLimitSignal } from './rate-limit-config.js'

/** Throw from a handler when the API signalled a rate limit (e.g. a 429). */
export class RateLimitError extends Error {
  constructor (readonly signal: RateLimitSignal) {
    super('Rate limit reached')
    this.name = 'RateLimitError'
  }
}
