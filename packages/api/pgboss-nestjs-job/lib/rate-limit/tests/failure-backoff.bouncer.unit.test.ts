import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { StoreUnavailablePolicy } from '../rate-limit-options.js'
import { FailureBackoffBouncer } from '../failure-backoff.bouncer.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('failure-test')
class TestFailureBouncer extends FailureBackoffBouncer {
  protected readonly options = { backoffSeconds: 30, maxBackoffSeconds: 120 }
}

@Bouncer('failure-closed-test')
class FailClosedFailureBouncer extends FailureBackoffBouncer {
  protected readonly options = { backoffSeconds: 30, onStoreUnavailable: StoreUnavailablePolicy.BLOCK }
}

@Bouncer('failure-500-test')
class SapStyleFailureBouncer extends FailureBackoffBouncer {
  protected readonly options = { backoffSeconds: 30, throttleStatuses: [500] }
}

function makeBouncer (): { bouncer: TestFailureBouncer, store: FakeRateLimitStore } {
  const store = new FakeRateLimitStore()

  return { bouncer: withStore(new TestFailureBouncer(), store), store }
}

function cooldownSeconds (until: Date | undefined): number {
  assert.ok(until != null)

  return Math.round((until.getTime() - Date.now()) / 1000)
}

describe('FailureBackoffBouncer', () => {
  it('proceeds by default (no proactive gate)', async () => {
    const { bouncer } = makeBouncer()

    assert.equal(await bouncer.canProceed(), true)
  })

  it('onError backs off for the configured backoffSeconds', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onError()

    assert.equal(cooldownSeconds(store.blocked.get('failure-test')), 30)
  })

  it('onResponse 429 honours Retry-After, capped by maxBackoffSeconds', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(429, { 'retry-after': '300' })

    assert.equal(cooldownSeconds(store.blocked.get('failure-test')), 120)
  })

  it('onResponse ignores non-429', async () => {
    const { bouncer, store } = makeBouncer()

    await bouncer.onResponse(200, {})

    assert.equal(store.blocked.size, 0)
  })

  it('holds when the store is unavailable and the bouncer opted to block', async () => {
    const store = new FakeRateLimitStore()
    const bouncer = withStore(new FailClosedFailureBouncer(), store)

    assert.equal(await bouncer.canProceed(), true)

    store.unavailable = true
    assert.equal(await bouncer.canProceed(), false)
  })

  it('backs off on a configured non-429 status', async () => {
    const store = new FakeRateLimitStore()
    const bouncer = withStore(new SapStyleFailureBouncer(), store)

    await bouncer.onResponse(500, {})

    assert.equal(cooldownSeconds(store.blocked.get('failure-500-test')), 30)
  })
})
