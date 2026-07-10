import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { StaticRateLimitBouncer } from '../static-rate-limit.bouncer.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('static-test')
class TestStaticBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60 }
}

function makeBouncer (): { bouncer: TestStaticBouncer, store: FakeRateLimitStore } {
  const store = new FakeRateLimitStore()

  return { bouncer: withStore(new TestStaticBouncer(), store), store }
}

describe('StaticRateLimitBouncer', () => {
  it('proceeds while under the limit and blocks once reached', async () => {
    const { bouncer, store } = makeBouncer()

    assert.equal(await bouncer.canProceed(), true)

    store.counts.set('static-test', 2)
    assert.equal(await bouncer.canProceed(), true)

    store.counts.set('static-test', 3)
    assert.equal(await bouncer.canProceed(), false)
  })

  it('onRequest increments the window counter', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onRequest()
    await bouncer.onRequest()

    assert.equal(store.counts.get('static-test'), 2)
  })

  it('onResponse sets a cooldown on 429 (Retry-After honoured)', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(429, { 'retry-after': '30' })

    const until = store.blocked.get('static-test')
    assert.ok(until != null)
    const seconds = Math.round((until.getTime() - Date.now()) / 1000)
    assert.ok(seconds > 25 && seconds <= 30, `unexpected cooldown ${seconds}s`)
  })

  it('onResponse does nothing on a non-429', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(200, {})

    assert.equal(store.blocked.size, 0)
  })
})
