import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgbossRateLimiter } from './rate-limiter.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'
import { RateLimitBucketRow } from './rate-limit.strategy.js'
import { RateLimitStore } from './rate-limit.store.js'

class FakeStore extends RateLimitStore {
  rows = new Map<string, RateLimitBucketRow>()
  async ensureSchema () {}
  getMany (keys: string[]) { return Promise.resolve(keys.map(k => this.rows.get(k)).filter(Boolean) as RateLimitBucketRow[]) }
  tryConsumeToken () { return Promise.resolve(true) }
  async setBlockedUntil () {}
  async setHeaderState () {}
}

const config = { source: 'static' as const, limit: 3, windowSeconds: 60 }
function registryDouble () {
  return {
    getAllKeys: () => ['stripe'],
    getStrategy: () => new StaticRateStrategy(config),
    getConfig: (k: string) => (k === 'stripe' ? config : undefined)
  } as never
}

describe('PgbossRateLimiter.blockedKeys', () => {
  it('reports a key as blocked when its stored row is exhausted', async () => {
    const store = new FakeStore()
    store.rows.set('stripe', { key: 'stripe', tokens: 0, windowStartAt: new Date(), resetAt: null, blockedUntil: null })
    const limiter = new PgbossRateLimiter(registryDouble(), store)

    assert.deepEqual(await limiter.blockedKeys(), ['stripe'])
  })

  it('does not block when budget remains', async () => {
    const store = new FakeStore()
    const limiter = new PgbossRateLimiter(registryDouble(), store)
    assert.deepEqual(await limiter.blockedKeys(), [])
  })

  it('blocks any key whose blockedUntil is in the future, even when its strategy would allow it', async () => {
    const store = new FakeStore()
    // tokens remain (static strategy alone would NOT block), but a 429 set a cooldown.
    store.rows.set('stripe', {
      key: 'stripe', tokens: 3, windowStartAt: new Date(), resetAt: null,
      blockedUntil: new Date(Date.now() + 60_000)
    })
    const limiter = new PgbossRateLimiter(registryDouble(), store)

    assert.deepEqual(await limiter.blockedKeys(), ['stripe'])
  })
})
