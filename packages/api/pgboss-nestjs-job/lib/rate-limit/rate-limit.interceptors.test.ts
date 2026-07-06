import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createRateLimitInterceptors } from './rate-limit.interceptors.js'
import { rateLimitStorage } from './rate-limit.context.js'
import { RateLimitError } from './rate-limit.error.js'

function fakeLimiter () {
  const calls: string[] = []
  const limiter = {
    onRequest: (k: string) => { calls.push(`req:${k}`); return Promise.resolve() },
    onResponse: (k: string, status: number) => { calls.push(`res:${k}:${status}`); return Promise.resolve() },
    onError: (k: string) => { calls.push(`err:${k}`); return Promise.resolve() }
  }

  return { calls, limiter }
}

describe('createRateLimitInterceptors', () => {
  it('request: calls onRequest with the current key and returns the request unchanged', async () => {
    const { calls, limiter } = fakeLimiter()
    const { request } = createRateLimitInterceptors(limiter)
    const req = new Request('https://api.example.com/x')

    const out = await rateLimitStorage.run({ key: 'stripe' }, () => request(req))

    assert.equal(out, req)
    assert.deepEqual(calls, ['req:stripe'])
  })

  it('request: no-op outside a job scope', async () => {
    const { calls, limiter } = fakeLimiter()
    const { request } = createRateLimitInterceptors(limiter)

    await request(new Request('https://api.example.com/x'))

    assert.deepEqual(calls, [])
  })

  it('response: reports and returns the response for a non-429', async () => {
    const { calls, limiter } = fakeLimiter()
    const { response } = createRateLimitInterceptors(limiter)
    const res = new Response(null, { status: 200, headers: { 'x-ratelimit-remaining': '5' } })

    const out = await rateLimitStorage.run({ key: 'gh' }, () => response(res, new Request('https://x')))

    assert.equal(out, res)
    assert.deepEqual(calls, ['res:gh:200'])
  })

  it('response: reports then throws RateLimitError on a 429', async () => {
    const { calls, limiter } = fakeLimiter()
    const { response } = createRateLimitInterceptors(limiter)
    const res = new Response(null, { status: 429, headers: { 'retry-after': '30' } })

    await rateLimitStorage.run({ key: 'flaky' }, async () => {
      await assert.rejects(() => response(res, new Request('https://x')), (e: unknown) => e instanceof RateLimitError)
    })

    assert.deepEqual(calls, ['res:flaky:429'])
  })

  it('error: reports a generic transport error but ignores our own RateLimitError', async () => {
    const { calls, limiter } = fakeLimiter()
    const { error } = createRateLimitInterceptors(limiter)

    await rateLimitStorage.run({ key: 'flaky' }, async () => {
      await error(new Error('network'), undefined, new Request('https://x'))
      await error(new RateLimitError({ throttled: true }), undefined, new Request('https://x'))
    })

    assert.deepEqual(calls, ['err:flaky'])
  })
})
