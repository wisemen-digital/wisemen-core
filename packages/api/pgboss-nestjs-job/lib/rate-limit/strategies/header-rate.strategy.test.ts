import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HeaderRateStrategy } from './header-rate.strategy.js'

const strategy = new HeaderRateStrategy({ source: 'headers' })
const now = new Date('2026-07-03T10:00:00Z')

describe('HeaderRateStrategy.isBlocked', () => {
  it('not blocked when no state known', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })
  it('blocked when remaining 0 and reset in the future', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: null, resetAt: new Date('2026-07-03T10:00:30Z'), blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), true)
  })
  it('not blocked once reset has passed', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: null, resetAt: new Date('2026-07-03T09:59:59Z'), blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), false)
  })
})
