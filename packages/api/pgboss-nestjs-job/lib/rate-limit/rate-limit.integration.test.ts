import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@wisemen/node-fetch'
import { useRateLimiting } from './rate-limit.interceptors.js'
import { rateLimitStorage } from './rate-limit.context.js'
import { RateLimitError } from './rate-limit.error.js'

function setup (fakeFetch: typeof fetch) {
  const calls: string[] = []
  const limiter = {
    onRequest: (k: string) => { calls.push(`req:${k}`); return Promise.resolve() },
    onResponse: (k: string, status: number) => { calls.push(`res:${k}:${status}`); return Promise.resolve() },
    onError: (k: string) => { calls.push(`err:${k}`); return Promise.resolve() }
  }
  const client = createClient({ fetch: fakeFetch })
  useRateLimiting(client, limiter)

  return { calls, client }
}

describe('useRateLimiting (node-fetch integration)', () => {
  it('accounts request + response for a successful call', async () => {
    const { calls, client } = setup(() => Promise.resolve(new Response(null, { status: 200 })))

    await rateLimitStorage.run({ key: 'stripe' }, () => client.get('https://api.example.com/x'))

    assert.deepEqual(calls, ['req:stripe', 'res:stripe:200'])
  })

  it('reports then throws RateLimitError on a 429 (no double-count via error channel)', async () => {
    const { calls, client } = setup(() => Promise.resolve(new Response(null, { status: 429 })))

    await rateLimitStorage.run({ key: 'flaky' }, async () => {
      await assert.rejects(
        () => client.get('https://api.example.com/x'),
        (e: unknown) => e instanceof RateLimitError
      )
    })

    assert.deepEqual(calls, ['req:flaky', 'res:flaky:429'])
  })

  it('accounts a transport error', async () => {
    const { calls, client } = setup(() => Promise.reject(new Error('network')))

    await rateLimitStorage.run({ key: 'flaky' }, async () => {
      await assert.rejects(
        () => client.get('https://api.example.com/x'),
        (e: unknown) => e instanceof Error && e.message === 'network'
      )
    })

    assert.deepEqual(calls, ['req:flaky', 'err:flaky'])
  })

  it('leaves requests made outside a job untouched', async () => {
    const { calls, client } = setup(() => Promise.resolve(new Response(null, { status: 200 })))

    await client.get('https://api.example.com/x')

    assert.deepEqual(calls, [])
  })
})
