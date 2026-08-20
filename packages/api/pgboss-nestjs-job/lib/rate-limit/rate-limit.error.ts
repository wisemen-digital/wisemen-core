import { RateLimitSignal } from './rate-limit-options.js'

/** Thrown on a throttled response so the job fails and retries after the cooldown, not succeeds. */
export class RateLimitError extends Error {
  constructor (readonly signal: RateLimitSignal) {
    super('Rate limit reached')
    this.name = 'RateLimitError'
  }
}
