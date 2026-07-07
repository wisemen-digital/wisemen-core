import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgbossRateLimiter } from './rate-limiter.js'
import { RateLimitStore } from './rate-limit.store.js'
import { RateLimitBucketRow } from './rate-limit.strategy.js'
import { RateLimitConfig } from './rate-limit-config.js'

class RecordingStore extends RateLimitStore {
  consumed: Array<[string, number, number]> = []
  blocked: Array<[string, Date]> = []
  header: Array<[string, number, Date | null]> = []
  async ensureSchema () {}
  getMany () { return Promise.resolve([] as RateLimitBucketRow[]) }
  tryConsumeToken (key: string, limit: number, windowSeconds: number) { this.consumed.push([key, limit, windowSeconds]); return Promise.resolve(true) }
  setBlockedUntil (key: string, until: Date) { this.blocked.push([key, until]); return Promise.resolve() }
  setHeaderState (key: string, remaining: number, resetAt: Date | null) { this.header.push([key, remaining, resetAt]); return Promise.resolve() }
}

function registryDouble (configs: Record<string, RateLimitConfig>) {
  return {
    getAllKeys: () => Object.keys(configs),
    getStrategy: () => ({ isBlocked: () => false }),
    getConfig: (k: string) => configs[k]
  } as never
}

const configs: Record<string, RateLimitConfig> = {
  stripe: { source: 'static', limit: 100, windowSeconds: 60 },
  gh: { source: 'headers' },
  flaky: { source: 'failure', backoffSeconds: 10 }
}

function limiter (store: RateLimitStore) {
  return new PgbossRateLimiter(registryDouble(configs), store)
}

describe('PgbossRateLimiter.onRequest', () => {
  it('consumes a token for a static key', async () => {
    const store = new RecordingStore()
    await limiter(store).onRequest('stripe')
    assert.deepEqual(store.consumed, [['stripe', 100, 60]])
  })

  it('does nothing for header, failure, or unknown keys', async () => {
    const store = new RecordingStore()
    const l = limiter(store)
    await l.onRequest('gh')
    await l.onRequest('flaky')
    await l.onRequest('nope')
    assert.deepEqual(store.consumed, [])
  })
})

describe('PgbossRateLimiter.onResponse', () => {
  it('records header state when remaining is present', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('gh', 200, { 'x-ratelimit-remaining': '5' })
    assert.equal(store.header.length, 1)
    assert.equal(store.header[0][0], 'gh')
    assert.equal(store.header[0][1], 5)
  })

  it('does not record header state when remaining is absent', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('gh', 200, {})
    assert.deepEqual(store.header, [])
  })

  it('blocks a failure key on a 429', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('flaky', 429, {})
    assert.equal(store.blocked.length, 1)
    assert.equal(store.blocked[0][0], 'flaky')
  })

  it('does not block a failure key on a 200', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('flaky', 200, {})
    assert.deepEqual(store.blocked, [])
  })

  it('blocks a static key on a 429 without recording header state', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('stripe', 429, {})
    assert.deepEqual(store.header, [])
    assert.equal(store.blocked.length, 1)
    assert.equal(store.blocked[0][0], 'stripe')
  })

  it('blocks a headers key on a 429', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('gh', 429, {})
    assert.equal(store.blocked.length, 1)
    assert.equal(store.blocked[0][0], 'gh')
  })

  it('honors Retry-After for a static 429 block, else a default cooldown', async () => {
    const store = new RecordingStore()
    const before = Date.now()
    await limiter(store).onResponse('stripe', 429, { 'retry-after': '30' })
    const until = store.blocked[0][1].getTime()
    assert.ok(until >= before + 29_000 && until <= before + 31_000, `expected ~30s, got ${until - before}ms`)
  })

  it('does nothing for a static key on a success', async () => {
    const store = new RecordingStore()
    await limiter(store).onResponse('stripe', 200, { 'x-ratelimit-remaining': '0' })
    assert.deepEqual(store.header, [])
    assert.deepEqual(store.blocked, [])
  })
})

describe('PgbossRateLimiter.onError', () => {
  it('blocks a failure key', async () => {
    const store = new RecordingStore()
    await limiter(store).onError('flaky')
    assert.equal(store.blocked.length, 1)
    assert.equal(store.blocked[0][0], 'flaky')
  })

  it('does nothing for non-failure keys', async () => {
    const store = new RecordingStore()
    const l = limiter(store)
    await l.onError('stripe')
    await l.onError('gh')
    assert.deepEqual(store.blocked, [])
  })
})
