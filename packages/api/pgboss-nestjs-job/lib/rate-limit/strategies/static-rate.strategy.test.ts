import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { StaticRateStrategy } from './static-rate.strategy.js'

const strategy = new StaticRateStrategy({ source: 'static', limit: 3, windowSeconds: 60 })
const now = new Date('2026-07-03T10:00:30Z')
const start = new Date('2026-07-03T10:00:00Z')

describe('StaticRateStrategy.isBlocked', () => {
  it('is not blocked when no row exists (full budget)', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })

  it('is blocked when tokens are exhausted inside the window', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: start, resetAt: null, blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), true)
  })

  it('is not blocked once the window has elapsed (refills)', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: start, resetAt: null, blockedUntil: null }
    const later = new Date('2026-07-03T10:01:05Z')
    assert.equal(strategy.isBlocked(row, later), false)
  })
})
