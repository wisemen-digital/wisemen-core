const BASE_DELAY_IN_SECONDS = 30
const MAX_DELAY_IN_SECONDS = 15 * 60
const JITTER_RATIO = 0.2
const MILLISECONDS_PER_SECOND = 1000

/** FCM's minimum retry delay for a rate-limited response. */
export const RATE_LIMITED_MINIMUM_DELAY_IN_MS = 60_000

/**
 * Exponential backoff with jitter for a push dispatch attempt.
 *
 * A provider-supplied `Retry-After` is honoured in full. The maximum delay applies only to the
 * locally calculated backoff, and `minimumDelayMs` sets a floor for either path.
 */
export function getPushRetryDelayInMs (
  attempt: number,
  retryAfterMs: number | null,
  random: () => number = Math.random,
  minimumDelayMs = 0
): number {
  if (retryAfterMs !== null) {
    return Math.max(retryAfterMs, minimumDelayMs)
  }

  const exponentialSeconds = BASE_DELAY_IN_SECONDS * Math.pow(2, Math.max(0, attempt - 1))
  const cappedSeconds = Math.min(exponentialSeconds, MAX_DELAY_IN_SECONDS)
  const jitter = 1 + ((random() * 2 - 1) * JITTER_RATIO)

  return Math.max(Math.round(cappedSeconds * jitter * MILLISECONDS_PER_SECOND), minimumDelayMs)
}

export function getPushRetryMoment (
  attempt: number,
  retryAfterMs: number | null,
  now: Date = new Date(),
  minimumDelayMs = 0
): Date {
  return new Date(
    now.getTime() + getPushRetryDelayInMs(attempt, retryAfterMs, Math.random, minimumDelayMs)
  )
}
