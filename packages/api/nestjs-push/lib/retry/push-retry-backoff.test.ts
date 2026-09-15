import { describe, it } from 'node:test'
import { expect } from 'expect'
import {
  getPushRetryDelayInMs,
  getPushRetryMoment,
  RATE_LIMITED_MINIMUM_DELAY_IN_MS
} from './push-retry-backoff.js'

const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000

describe('getPushRetryDelayInMs', () => {
  it('grows exponentially and stays inside the cap', () => {
    const withoutJitter = (attempt: number): number =>
      getPushRetryDelayInMs(attempt, null, () => 0.5)

    expect(withoutJitter(1)).toBe(30_000)
    expect(withoutJitter(2)).toBe(60_000)
    expect(withoutJitter(3)).toBe(120_000)
    expect(withoutJitter(20)).toBe(FIFTEEN_MINUTES_IN_MS)
  })

  it('applies jitter around the exponential delay', () => {
    const lowest = getPushRetryDelayInMs(1, null, () => 0)
    const highest = getPushRetryDelayInMs(1, null, () => 1)

    expect(lowest).toBe(24_000)
    expect(highest).toBe(36_000)
  })

  it('prefers the retry hint the provider gave us', () => {
    expect(getPushRetryDelayInMs(1, 5_000)).toBe(5_000)
  })

  it('never shortens a retry hint to our own backoff cap', () => {
    expect(getPushRetryDelayInMs(1, FIFTEEN_MINUTES_IN_MS * 4))
      .toBe(FIFTEEN_MINUTES_IN_MS * 4)
  })

  describe('rate limited results', () => {
    const rateLimited = (retryAfterMs: number | null): number =>
      getPushRetryDelayInMs(1, retryAfterMs, () => 0.5, RATE_LIMITED_MINIMUM_DELAY_IN_MS)

    it('waits at least a minute when the provider gave no hint', () => {
      expect(rateLimited(null)).toBe(RATE_LIMITED_MINIMUM_DELAY_IN_MS)
    })

    it('waits the minimum even when the provider asked for less', () => {
      expect(rateLimited(10_000)).toBe(RATE_LIMITED_MINIMUM_DELAY_IN_MS)
    })

    it('honours a provider hint longer than the minimum', () => {
      expect(rateLimited(120_000)).toBe(120_000)
      expect(rateLimited(FIFTEEN_MINUTES_IN_MS * 4)).toBe(FIFTEEN_MINUTES_IN_MS * 4)
    })

    it('raises the floor without flattening the exponential growth above it', () => {
      const withFloor = (attempt: number): number =>
        getPushRetryDelayInMs(attempt, null, () => 0.5, RATE_LIMITED_MINIMUM_DELAY_IN_MS)

      expect(withFloor(2)).toBe(60_000)
      expect(withFloor(3)).toBe(120_000)
      expect(withFloor(20)).toBe(FIFTEEN_MINUTES_IN_MS)
    })
  })

  it('leaves delays unchanged when no minimum is asked for', () => {
    expect(getPushRetryDelayInMs(1, null, () => 0.5)).toBe(30_000)
    expect(getPushRetryDelayInMs(1, null, () => 0.5, 0)).toBe(30_000)
    expect(getPushRetryDelayInMs(1, 5_000, Math.random, 0)).toBe(5_000)
  })
})

describe('getPushRetryMoment', () => {
  it('returns a moment in the future', () => {
    const now = new Date('2026-09-08T10:00:00.000Z')

    expect(getPushRetryMoment(1, 5_000, now).toISOString())
      .toBe('2026-09-08T10:00:05.000Z')
  })

  it('applies the minimum delay it was given', () => {
    const now = new Date('2026-09-08T10:00:00.000Z')

    expect(getPushRetryMoment(1, 10_000, now, RATE_LIMITED_MINIMUM_DELAY_IN_MS).toISOString())
      .toBe('2026-09-08T10:01:00.000Z')
  })
})
