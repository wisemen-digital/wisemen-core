import { FailureBackoffOptions, RateLimitSignal } from './rate-limit-options.js'

/**
 * Compute the instant a failure-backoff cooldown clears: honour the API's
 * `Retry-After` when present, otherwise fall back to the configured backoff,
 * capped by `maxBackoffSeconds` when set.
 */
export function nextBackoff (
  options: FailureBackoffOptions,
  signal: RateLimitSignal,
  now: Date
): Date {
  const retryAfter = signal.retryAfterSeconds
  const requested = retryAfter !== undefined && Number.isFinite(retryAfter) && retryAfter > 0
    ? retryAfter
    : options.backoffSeconds
  const capped = options.maxBackoffSeconds != null
    ? Math.min(requested, options.maxBackoffSeconds)
    : requested

  return new Date(now.getTime() + capped * 1000)
}
