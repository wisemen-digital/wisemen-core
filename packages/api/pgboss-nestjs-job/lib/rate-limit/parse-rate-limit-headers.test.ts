import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimitHeaders } from './parse-rate-limit-headers.js'

describe('parseRateLimitHeaders', () => {
  it('reads standard X-RateLimit headers', () => {
    const sig = parseRateLimitHeaders(
      { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1751536830' },
      { source: 'headers' }
    )
    assert.equal(sig.remaining, 0)
    assert.ok(sig.resetAt instanceof Date)
  })

  it('reads Retry-After seconds on 429', () => {
    const sig = parseRateLimitHeaders({ 'retry-after': '30' }, { source: 'headers' })
    assert.equal(sig.retryAfterSeconds, 30)
  })

  it('ignores a non-numeric remaining header instead of yielding NaN', () => {
    const sig = parseRateLimitHeaders({ 'x-ratelimit-remaining': 'unknown' }, { source: 'headers' })
    assert.equal(sig.remaining, undefined)
  })

  it('ignores an empty remaining header instead of yielding 0', () => {
    const sig = parseRateLimitHeaders({ 'x-ratelimit-remaining': '' }, { source: 'headers' })
    assert.equal(sig.remaining, undefined)
  })

  it('ignores a non-numeric reset header instead of an Invalid Date', () => {
    const sig = parseRateLimitHeaders({ 'x-ratelimit-reset': 'later' }, { source: 'headers' })
    assert.equal(sig.resetAt, undefined)
  })

  it('ignores a non-numeric Retry-After (e.g. HTTP-date) instead of NaN', () => {
    const sig = parseRateLimitHeaders({ 'retry-after': 'Wed, 21 Oct 2025 07:28:00 GMT' }, { source: 'headers' })
    assert.equal(sig.retryAfterSeconds, undefined)
  })
})
