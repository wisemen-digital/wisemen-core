import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { StoreUnavailablePolicy } from '../rate-limit-options.js'
import { StaticRateLimitBouncer } from '../static-rate-limit.bouncer.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('base-test')
class TestBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60 }
}

@Bouncer('fail-closed-test')
class FailClosedBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60, onStoreUnavailable: StoreUnavailablePolicy.BLOCK }
}

@Bouncer('custom-statuses-test')
class CustomStatusBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60, throttleStatuses: [503, 500] }
}

@Bouncer('override-test')
class OverridingBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 3, windowSeconds: 60 }

  override isThrottleResponse (status: number, headers: Record<string, string | undefined>): boolean {
    return status === 400 && headers['x-sap-throttled'] === 'true'
  }
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

  it('treats only 429 as throttling by default', () => {
    const bouncer = withStore(new TestBouncer(), new FakeRateLimitStore())

    assert.equal(bouncer.isThrottleResponse(429, {}), true)
    assert.equal(bouncer.isThrottleResponse(503, {}), false)
    assert.equal(bouncer.isThrottleResponse(200, {}), false)
  })

  it('honours throttleStatuses for APIs that do not use 429', () => {
    const bouncer = withStore(new CustomStatusBouncer(), new FakeRateLimitStore())

    assert.equal(bouncer.isThrottleResponse(503, {}), true)
    assert.equal(bouncer.isThrottleResponse(500, {}), true)
    // Opting into other statuses replaces the default rather than adding to it.
    assert.equal(bouncer.isThrottleResponse(429, {}), false)
  })

  it('lets a subclass override the decision entirely', () => {
    const bouncer = withStore(new OverridingBouncer(), new FakeRateLimitStore())

    assert.equal(bouncer.isThrottleResponse(400, { 'x-sap-throttled': 'true' }), true)
    assert.equal(bouncer.isThrottleResponse(400, {}), false)
    assert.equal(bouncer.isThrottleResponse(429, {}), false)
  })

  it('fails open when the store is unavailable', async () => {
    const store = new FakeRateLimitStore()
    store.unavailable = true
    const bouncer = withStore(new TestBouncer(), store)

    assert.equal(await bouncer.canProceed(), true)
  })

  it('holds the queue when the store is unavailable and the bouncer opted to block', async () => {
    const store = new FakeRateLimitStore()
    store.unavailable = true
    const bouncer = withStore(new FailClosedBouncer(), store)

    assert.equal(await bouncer.canProceed(), false)
  })

  it('a fail-closed bouncer still proceeds normally while the store answers', async () => {
    const store = new FakeRateLimitStore()
    const bouncer = withStore(new FailClosedBouncer(), store)

    assert.equal(await bouncer.canProceed(), true)

    // ...and still enforces the budget rather than blocking everything.
    store.counts.set('fail-closed-test', 3)
    assert.equal(await bouncer.canProceed(), false)
  })
})
