import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'

describe('PgbossRateLimitRegistry', () => {
  it('builds config and a strategy per key from the central limits map', () => {
    const registry = new PgbossRateLimitRegistry({
      stripe: { source: 'static', limit: 100, windowSeconds: 60 }
    })

    assert.deepEqual(registry.getAllKeys(), ['stripe'])
    assert.deepEqual(registry.getConfig('stripe'), { source: 'static', limit: 100, windowSeconds: 60 })
    assert.ok(registry.getStrategy('stripe') instanceof StaticRateStrategy)
  })

  it('returns undefined for unknown keys and empty for no limits', () => {
    const registry = new PgbossRateLimitRegistry({})

    assert.equal(registry.getConfig('nope'), undefined)
    assert.equal(registry.getStrategy('nope'), undefined)
    assert.deepEqual(registry.getAllKeys(), [])
  })
})
