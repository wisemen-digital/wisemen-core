import { FailureBackoffOptions, RateLimitSignal } from './rate-limit-options.js'

/** When a failure-backoff cooldown clears: `Retry-After` if given, else the configured backoff, capped. */
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
