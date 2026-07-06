import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { refill } from './refill.js'

const config = { source: 'static' as const, limit: 3, windowSeconds: 60 }

describe('refill', () => {
  it('creates a full bucket when none exists', () => {
    const now = new Date('2026-07-03T10:00:00Z')
    const b = refill(null, config, now)
    assert.equal(b.tokens, 3)
    assert.equal(b.windowStartAt.toISOString(), now.toISOString())
  })

  it('keeps the bucket unchanged inside the window', () => {
    const start = new Date('2026-07-03T10:00:00Z')
    const now = new Date('2026-07-03T10:00:30Z')
    const b = refill({ tokens: 1, windowStartAt: start }, config, now)
    assert.equal(b.tokens, 1)
    assert.equal(b.windowStartAt.toISOString(), start.toISOString())
  })

  it('refills to full at a new window once the window elapsed', () => {
    const start = new Date('2026-07-03T10:00:00Z')
    const now = new Date('2026-07-03T10:01:05Z')
    const b = refill({ tokens: 0, windowStartAt: start }, config, now)
    assert.equal(b.tokens, 3)
    assert.equal(b.windowStartAt.toISOString(), now.toISOString())
  })
})
