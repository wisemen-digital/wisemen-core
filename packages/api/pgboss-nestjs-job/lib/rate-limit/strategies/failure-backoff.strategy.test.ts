import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { FailureBackoffStrategy, nextBackoff } from './failure-backoff.strategy.js'

const config = { source: 'failure' as const, backoffSeconds: 10, maxBackoffSeconds: 60 }
const strategy = new FailureBackoffStrategy(config)
const now = new Date('2026-07-03T10:00:00Z')

describe('FailureBackoffStrategy', () => {
  it('not blocked when no cooldown set', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })
  it('blocked while blocked_until is in the future', () => {
    const row = { key: 'k', tokens: null, windowStartAt: null, resetAt: null, blockedUntil: new Date('2026-07-03T10:00:05Z') }
    assert.equal(strategy.isBlocked(row, now), true)
  })
  it('nextBackoff prefers retryAfter and caps at max', () => {
    assert.equal(nextBackoff(config, { retryAfterSeconds: 120 }, now).toISOString(), '2026-07-03T10:01:00.000Z')
    assert.equal(nextBackoff(config, {}, now).toISOString(), '2026-07-03T10:00:10.000Z')
  })
})
