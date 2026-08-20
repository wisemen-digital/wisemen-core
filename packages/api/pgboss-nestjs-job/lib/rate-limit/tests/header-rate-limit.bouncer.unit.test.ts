import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { StoreUnavailablePolicy } from '../rate-limit-options.js'
import { HeaderRateLimitBouncer } from '../header-rate-limit.bouncer.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('header-test')
class TestHeaderBouncer extends HeaderRateLimitBouncer {
  protected readonly options = {}
}

@Bouncer('header-closed-test')
class FailClosedHeaderBouncer extends HeaderRateLimitBouncer {
  protected readonly options = { onStoreUnavailable: StoreUnavailablePolicy.BLOCK }
}

function makeBouncer (): { bouncer: TestHeaderBouncer, store: FakeRateLimitStore } {
  const store = new FakeRateLimitStore()

  return { bouncer: withStore(new TestHeaderBouncer(), store), store }
}

describe('HeaderRateLimitBouncer', () => {
  it('proceeds when no state is known yet', async () => {
    const { bouncer } = makeBouncer()

    assert.equal(await bouncer.canProceed(), true)
  })

  it('tells "no state yet" apart from "store unavailable" when opted to block', async () => {
    const store = new FakeRateLimitStore()
    const bouncer = withStore(new FailClosedHeaderBouncer(), store)

    // No state and a healthy store: nothing is known, so work flows.
    assert.equal(await bouncer.canProceed(), true)

    store.unavailable = true
    assert.equal(await bouncer.canProceed(), false)
  })

  it('proceeds while remaining > 0', async () => {
    const { bouncer, store } = makeBouncer()
    store.headerStates.set('header-test', { remaining: 5, resetAt: null })

    assert.equal(await bouncer.canProceed(), true)
  })

  it('blocks when exhausted before reset, proceeds after reset', async () => {
    const { bouncer, store } = makeBouncer()

    store.headerStates.set('header-test', { remaining: 0, resetAt: new Date(Date.now() + 60_000) })
    assert.equal(await bouncer.canProceed(), false)

    store.headerStates.set('header-test', { remaining: 0, resetAt: new Date(Date.now() - 1_000) })
    assert.equal(await bouncer.canProceed(), true)
  })

  it('onResponse records the reported remaining/reset', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(200, { 'x-ratelimit-remaining': '2', 'x-ratelimit-reset': '1751536830' })

    const state = store.headerStates.get('header-test')
    assert.equal(state?.remaining, 2)
    assert.equal(state?.resetAt?.getTime(), 1751536830 * 1000)
  })

  it('onResponse sets a cooldown on 429', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(429, {})

    assert.ok(store.blocked.get('header-test') != null)
  })
})
