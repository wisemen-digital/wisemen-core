import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { StaticRateLimitBouncer } from '../static-rate-limit.bouncer.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('base-test')
class TestBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60 }
}

describe('RateLimitBouncer (base behaviour)', () => {
  it('exposes the store as inherited Nest property-injection metadata', () => {
    // The crux of the DI design: @Inject on the abstract base must be visible
    // when Nest inspects the concrete @Bouncer subclass.
    const meta = Reflect.getMetadata('self:properties_metadata', TestBouncer) as
      | Array<{ key: string }>
      | undefined

    assert.ok(meta?.some(entry => entry.key === 'store') === true, 'store injection metadata not inherited')
  })

  it('derives its key from the @Bouncer decorator', async () => {
    const bouncer = withStore(new TestBouncer(), new FakeRateLimitStore())

    // A future cooldown on the queue key blocks it.
    const store = new FakeRateLimitStore()
    store.blocked.set('base-test', new Date(Date.now() + 60_000))
    withStore(bouncer, store)

    assert.equal(await bouncer.canProceed(), false)
  })

  it('a blockedUntil cooldown gates the queue even with budget remaining', async () => {
    const store = new FakeRateLimitStore()
    store.blocked.set('base-test', new Date(Date.now() + 60_000))
    const bouncer = withStore(new TestBouncer(), store)

    assert.equal(await bouncer.canProceed(), false)
  })

  it('proceeds once the cooldown has passed', async () => {
    const store = new FakeRateLimitStore()
    store.blocked.set('base-test', new Date(Date.now() - 1_000))
    const bouncer = withStore(new TestBouncer(), store)

    assert.equal(await bouncer.canProceed(), true)
  })

  it('fails open when the store is unavailable', async () => {
    const store = new FakeRateLimitStore()
    store.unavailable = true
    const bouncer = withStore(new TestBouncer(), store)

    assert.equal(await bouncer.canProceed(), true)
  })
})
