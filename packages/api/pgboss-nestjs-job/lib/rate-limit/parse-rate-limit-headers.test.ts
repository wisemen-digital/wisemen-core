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
})
