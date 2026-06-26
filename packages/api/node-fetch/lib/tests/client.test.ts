import { beforeEach, describe, it } from 'node:test'
import { expect } from 'expect'

import { createClient } from '../client.js'

const ok = (body: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' }, status: 200, ...init })

describe('createClient', () => {
  let captured: Request[]
  let queued: Response[]

  const mockFetch = async (req: Request): Promise<Response> => {
    captured.push(req)
    const res = queued.shift()
    if (!res) throw new Error('No response queued')
    return res
  }

  beforeEach(() => {
    captured = []
    queued = []
  })

  const client = () => createClient({ baseUrl: 'https://api.example.com', fetch: mockFetch as typeof fetch })
  const queue = (res: Response): void => { queued.push(res) }

  describe('URL resolution', () => {
    it('prepends baseUrl to relative paths', async () => {
      queue(ok({}))
      await client().fetch('/users')
      expect(captured[0].url).toBe('https://api.example.com/users')
    })

    it('does not prepend baseUrl to absolute URLs', async () => {
      queue(ok({}))
      await client().fetch('https://other.example.com/data')
      expect(captured[0].url).toBe('https://other.example.com/data')
    })

    it('strips trailing slash from baseUrl before joining', async () => {
      queue(ok({}))
      const c = createClient({ baseUrl: 'https://api.example.com/', fetch: mockFetch as typeof fetch })
      await c.fetch('/users')
      expect(captured[0].url).toBe('https://api.example.com/users')
    })

    it('adds leading slash if path does not start with one', async () => {
      queue(ok({}))
      await client().fetch('users')
      expect(captured[0].url).toBe('https://api.example.com/users')
    })
  })

  describe('HTTP method helpers', () => {
    it('GET sets method to GET', async () => {
      queue(ok({}))
      await client().get('/ping')
      expect(captured[0].method).toBe('GET')
    })

    it('POST sets method to POST', async () => {
      queue(ok({}))
      await client().post('/users', { body: '{"name":"Alice"}' })
      expect(captured[0].method).toBe('POST')
    })

    it('PUT sets method to PUT', async () => {
      queue(ok({}))
      await client().put('/users/1', { body: '{"name":"Alice"}' })
      expect(captured[0].method).toBe('PUT')
    })

    it('PATCH sets method to PATCH', async () => {
      queue(ok({}))
      await client().patch('/users/1', { body: '{"name":"Alice"}' })
      expect(captured[0].method).toBe('PATCH')
    })

    it('DELETE sets method to DELETE', async () => {
      queue(ok({}))
      await client().delete('/users/1')
      expect(captured[0].method).toBe('DELETE')
    })

    it('HEAD sets method to HEAD', async () => {
      queue(new Response(null, { status: 200 }))
      await client().head('/ping')
      expect(captured[0].method).toBe('HEAD')
    })

    it('OPTIONS sets method to OPTIONS', async () => {
      queue(new Response(null, { status: 204 }))
      await client().options('/ping')
      expect(captured[0].method).toBe('OPTIONS')
    })
  })

  describe('headers', () => {
    it('merges client-level default headers', async () => {
      queue(ok({}))
      const c = createClient({
        baseUrl: 'https://api.example.com',
        fetch: mockFetch as typeof fetch,
        headers: { 'X-App': 'my-app' },
      })
      await c.get('/ping')
      expect(captured[0].headers.get('x-app')).toBe('my-app')
    })

    it('merges per-request headers with defaults', async () => {
      queue(ok({}))
      const c = createClient({
        baseUrl: 'https://api.example.com',
        fetch: mockFetch as typeof fetch,
        headers: { 'X-Default': 'yes' },
      })
      await c.get('/ping', { headers: { 'X-Request': 'also' } })
      expect(captured[0].headers.get('x-default')).toBe('yes')
      expect(captured[0].headers.get('x-request')).toBe('also')
    })

    it('per-request headers override defaults', async () => {
      queue(ok({}))
      const c = createClient({
        baseUrl: 'https://api.example.com',
        fetch: mockFetch as typeof fetch,
        headers: { 'X-Version': '1' },
      })
      await c.get('/ping', { headers: { 'X-Version': '2' } })
      expect(captured[0].headers.get('x-version')).toBe('2')
    })
  })

  describe('passes through RequestInit options', () => {
    it('forwards credentials', async () => {
      queue(ok({}))
      await client().get('/secure', { credentials: 'include' })
      expect(captured[0].credentials).toBe('include')
    })

    it('forwards signal', async () => {
      queue(ok({}))
      const ac = new AbortController()
      await client().get('/ping', { signal: ac.signal })
      expect(captured[0].signal).not.toBeNull()
    })
  })

  describe('returns the native Response', () => {
    it('returns the response object', async () => {
      queue(ok({ id: 1 }))
      const res = await client().get('/users/1')
      expect(res).toBeInstanceOf(Response)
      expect(res.ok).toBe(true)
    })

    it('returns non-ok responses without throwing', async () => {
      queue(new Response('Not Found', { status: 404 }))
      const res = await client().get('/missing')
      expect(res.status).toBe(404)
    })
  })

  describe('request interceptors', () => {
    it('runs before fetch and can modify the request', async () => {
      queue(ok({}))
      const c = client()
      c.interceptors.request.use((req) => {
        req.headers.set('Authorization', 'Bearer token')
        return req
      })
      await c.get('/secure')
      expect(captured[0].headers.get('authorization')).toBe('Bearer token')
    })

    it('runs multiple request interceptors in order', async () => {
      queue(ok({}))
      const order: number[] = []
      const c = client()
      c.interceptors.request.use((req) => { order.push(1); return req })
      c.interceptors.request.use((req) => { order.push(2); return req })
      await c.get('/ping')
      expect(order).toEqual([1, 2])
    })

    it('skips ejected interceptors', async () => {
      queue(ok({}))
      let called = false
      const c = client()
      const id = c.interceptors.request.use((req) => { called = true; return req })
      c.interceptors.request.eject(id)
      await c.get('/ping')
      expect(called).toBe(false)
    })

    it('supports async request interceptors', async () => {
      queue(ok({}))
      const c = client()
      c.interceptors.request.use(async (req) => {
        await Promise.resolve()
        req.headers.set('X-Async', 'yes')
        return req
      })
      await c.get('/ping')
      expect(captured[0].headers.get('x-async')).toBe('yes')
    })
  })

  describe('response interceptors', () => {
    it('runs after fetch with the response', async () => {
      queue(ok({ value: 1 }))
      let seen: Response | null = null
      const c = client()
      c.interceptors.response.use((res) => { seen = res; return res })
      await c.get('/ping')
      expect(seen).toBeInstanceOf(Response)
    })

    it('can replace the response', async () => {
      queue(ok({ original: true }))
      const replacement = new Response('replaced', { status: 200 })
      const c = client()
      c.interceptors.response.use(() => replacement)
      const res = await c.get('/ping')
      expect(res).toBe(replacement)
    })
  })

  describe('error interceptors', () => {
    it('runs on network error and rethrows', async () => {
      const networkError = new TypeError('Failed to fetch')
      let seen: unknown
      const c = createClient({
        fetch: async () => { throw networkError },
      })
      c.interceptors.error.use((err) => { seen = err; return err })
      await expect(c.get('https://api.example.com/offline')).rejects.toBeInstanceOf(TypeError)
      expect(seen).toBe(networkError)
    })

    it('can replace the thrown error', async () => {
      const c = createClient({
        fetch: async () => { throw new Error('original') },
      })
      c.interceptors.error.use(() => new Error('replaced'))
      await expect(c.get('https://api.example.com/fail')).rejects.toMatchObject({ message: 'replaced' })
    })
  })

  describe('no baseUrl', () => {
    it('uses absolute URL as-is when no baseUrl is set', async () => {
      queue(ok({}))
      const c = createClient({ fetch: mockFetch as typeof fetch })
      await c.get('https://api.example.com/users')
      expect(captured[0].url).toBe('https://api.example.com/users')
    })
  })
})
