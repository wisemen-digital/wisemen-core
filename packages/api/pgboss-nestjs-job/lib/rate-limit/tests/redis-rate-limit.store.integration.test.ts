import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { RedisClient } from '@wisemen/nestjs-redis'
import { RedisRateLimitStore } from '../redis-rate-limit.store.js'

const url = process.env.REDIS_TEST_URL

describe('RedisRateLimitStore — fail-open (no Redis needed)', () => {
  // A client that was never initialised: `.client` throws, so every op must
  // fall back to allow/no-op rather than propagate.
  const store = new RedisRateLimitStore(new RedisClient({ url: 'redis://127.0.0.1:6379' }))

  it('reads return allow fallbacks', async () => {
    assert.equal(await store.getCount('k'), 0)
    assert.equal(await store.getBlockedUntil('k'), null)
    assert.equal(await store.getHeaderState('k'), null)
  })

  it('writes and increments do not throw', async () => {
    assert.equal(await store.incrementWindow('k', 60), null)
    await assert.doesNotReject(store.setBlockedUntil('k', new Date(Date.now() + 1000)))
    await assert.doesNotReject(store.setHeaderState('k', 0, null))
  })
})

describe('RedisRateLimitStore — live', { skip: url == null }, () => {
  let client: RedisClient
  let store: RedisRateLimitStore
  const key = 'itest'

  before(async () => {
    client = new RedisClient({ url: url as string })
    await client.onModuleInit()
    store = new RedisRateLimitStore(client)
    await client.client.del([`ratelimit:${key}:count`, `ratelimit:${key}:header`, `ratelimit:${key}:blocked`])
  })

  after(async () => {
    await client.client.del([`ratelimit:${key}:count`, `ratelimit:${key}:header`, `ratelimit:${key}:blocked`])
    await client.onModuleDestroy()
  })

  it('increments a fixed window and arms a TTL that is not extended by later increments', async () => {
    assert.equal(await store.incrementWindow(key, 100), 1)
    const firstTtl = await client.client.ttl(`ratelimit:${key}:count`)
    assert.ok(firstTtl > 0 && firstTtl <= 100, `unexpected ttl ${firstTtl}`)

    assert.equal(await store.incrementWindow(key, 100), 2)
    assert.equal(await store.getCount(key), 2)

    const secondTtl = await client.client.ttl(`ratelimit:${key}:count`)
    // EXPIRE NX must not push the TTL back out to a fresh 100s.
    assert.ok(secondTtl > 0 && secondTtl <= firstTtl, `ttl was extended: ${firstTtl} -> ${secondTtl}`)
  })

  it('round-trips header state', async () => {
    const resetAt = new Date(Math.floor(Date.now() / 1000) * 1000 + 60_000)
    await store.setHeaderState(key, 7, resetAt)

    const state = await store.getHeaderState(key)
    assert.equal(state?.remaining, 7)
    assert.equal(state?.resetAt?.getTime(), resetAt.getTime())
  })

  it('bounds header state with a TTL so it cannot wedge the queue (H1)', async () => {
    // Exhausted with an unknown reset: must still expire (fallback window).
    await store.setHeaderState(key, 0, null)
    const fallbackTtl = await client.client.ttl(`ratelimit:${key}:header`)
    assert.ok(fallbackTtl > 0 && fallbackTtl <= 60, `expected fallback ttl, got ${fallbackTtl}`)

    // Known future reset: TTL should outlive the reset it drives.
    await store.setHeaderState(key, 0, new Date(Date.now() + 120_000))
    const resetTtl = await client.client.ttl(`ratelimit:${key}:header`)
    assert.ok(resetTtl > 115 && resetTtl <= 130, `expected ~reset ttl, got ${resetTtl}`)
  })

  it('round-trips a blockedUntil cooldown', async () => {
    const until = new Date(Date.now() + 30_000)
    await store.setBlockedUntil(key, until)

    const stored = await store.getBlockedUntil(key)
    assert.equal(stored?.getTime(), until.getTime())
  })
})
