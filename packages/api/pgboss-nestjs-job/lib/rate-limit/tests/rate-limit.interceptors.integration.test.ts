import 'reflect-metadata'
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@wisemen/node-fetch'
import { Bouncer } from '../../worker/pgboss-bouncer.decorator.js'
import { RateLimitError } from '../rate-limit.error.js'
import { StaticRateLimitBouncer } from '../static-rate-limit.bouncer.js'
import { useRateLimiting } from '../rate-limit.interceptors.js'
import { FakeRateLimitStore, withStore } from './fake-rate-limit.store.js'

@Bouncer('interceptor-test')
class RecordingBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 5, windowSeconds: 60 }
  readonly calls: string[] = []
  override onRequest (): Promise<void> {
    this.calls.push('req')

    return Promise.resolve()
  }

  override onResponse (status: number): Promise<void> {
    this.calls.push(`res:${status}`)

    return Promise.resolve()
  }

  override onError (): Promise<void> {
    this.calls.push('err')

    return Promise.resolve()
  }
}

function makeBouncer (): RecordingBouncer {
  return withStore(new RecordingBouncer(), new FakeRateLimitStore())
}

describe('useRateLimiting (through a real node-fetch client)', () => {
  it('drives onRequest + onResponse for a normal response', async () => {
    const bouncer = makeBouncer()
    const client = createClient({ fetch: () => Promise.resolve(new Response('ok', { status: 200 })) })
    useRateLimiting(client, bouncer)

    const res = await client.get('https://api.test/thing')

    assert.equal(res.status, 200)
    assert.deepEqual(bouncer.calls, ['req', 'res:200'])
  })

  it('records the response then throws RateLimitError on a 429', async () => {
    const bouncer = makeBouncer()
    const client = createClient({
      fetch: () => Promise.resolve(new Response('slow down', { status: 429, headers: { 'retry-after': '30' } }))
    })
    useRateLimiting(client, bouncer)

    await assert.rejects(client.get('https://api.test/thing'), (error: unknown) => {
      assert.ok(error instanceof RateLimitError)
      assert.equal(error.signal.retryAfterSeconds, 30)

      return true
    })

    assert.deepEqual(bouncer.calls, ['req', 'res:429'])
  })

  it('drives onError on a transport failure', async () => {
    const bouncer = makeBouncer()
    const client = createClient({ fetch: () => Promise.reject(new Error('boom')) })
    useRateLimiting(client, bouncer)

    await assert.rejects(client.get('https://api.test/thing'))

    assert.deepEqual(bouncer.calls, ['req', 'err'])
  })
})
