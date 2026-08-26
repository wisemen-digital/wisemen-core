import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimitHeaders, parseRetryAfterSeconds } from '../parse-rate-limit-headers.js'

describe('parseRateLimitHeaders', () => {
  it('reads standard X-RateLimit headers (reset as epoch seconds)', () => {
    const signal = parseRateLimitHeaders(
      { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1751536830' },
      {}
    )

    assert.equal(signal.remaining, 0)
    assert.equal(signal.resetAt?.getTime(), 1751536830 * 1000)
  })

  it('honours custom header names', () => {
    const signal = parseRateLimitHeaders(
      { 'x-my-remaining': '5' },
      { remainingHeader: 'x-my-remaining' }
    )

    assert.equal(signal.remaining, 5)
  })

  it('ignores blank / non-numeric values', () => {
    const signal = parseRateLimitHeaders({ 'x-ratelimit-remaining': '' }, {})

    assert.equal(signal.remaining, undefined)
  })
})

describe('parseRetryAfterSeconds', () => {
  it('reads a positive Retry-After', () => {
    assert.equal(parseRetryAfterSeconds({ 'retry-after': '30' }), 30)
  })

  it('returns undefined when absent or non-positive', () => {
    assert.equal(parseRetryAfterSeconds({}), undefined)
    assert.equal(parseRetryAfterSeconds({ 'retry-after': '0' }), undefined)
  })
})
