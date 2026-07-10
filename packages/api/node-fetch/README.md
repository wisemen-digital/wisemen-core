# @wisemen/node-fetch

A fetch client with a typed interceptor pipeline. Attach hooks that run before a request is sent, after a response is received, or when an error occurs — compatible with the interceptor API used by [hey-api](https://heyapi.dev) generated clients.

## Installation

```bash
pnpm add @wisemen/node-fetch
```

## Quick start

```ts
import { createClient } from '@wisemen/node-fetch'

const client = createClient({
  baseUrl: 'https://api.example.com',
  headers: { 'X-App': 'my-app' },
})

client.interceptors.request.use(async (req) => {
  req.headers.set('Authorization', `Bearer ${await getToken()}`)
  return req
})

const res = await client.get('/users')
const data = await res.json()
```

---

## `createClient(config?)`

Returns a `FetchClient` — a thin wrapper around the native `fetch` API with an interceptor pipeline applied to every call.

```ts
interface ClientConfig {
  baseUrl?: string      // prepended to every relative URL
  fetch?: typeof fetch  // custom fetch implementation (useful for testing)
  headers?: HeadersInit // default headers merged into every request
}
```

### HTTP methods

All methods mirror the native `fetch` signature and return a native `Response`. Non-2xx responses are **not** thrown — they pass through to the response interceptors like any other response.

```ts
client.fetch(input, init?)   // same signature as globalThis.fetch
client.get(url, init?)
client.post(url, init?)
client.put(url, init?)
client.patch(url, init?)
client.delete(url, init?)
client.head(url, init?)
client.options(url, init?)
```

---

## Interceptors

Each interceptor channel is available on `client.interceptors`:

| Channel | When it runs |
|---|---|
| `request` | Before the request is sent — use it to add auth headers, inject trace IDs, etc. |
| `response` | After a response is received — use it to refresh tokens, log responses, etc. |
| `error` | When `fetch` throws (network failure, abort) — use it to log or transform the error. |

### Request interceptor

Receives the outgoing `Request`, must return the (possibly modified) request.

```ts
client.interceptors.request.use(async (req) => {
  req.headers.set('Authorization', `Bearer ${await getToken()}`)
  return req
})
```

### Response interceptor

Receives the `Response` and the original `Request`. Must return the (possibly modified) response.

```ts
client.interceptors.response.use(async (res, req) => {
  if (res.status !== 401) return res

  // Refresh the token and retry once
  await refreshToken()
  const retry = new Request(req.url, { method: req.method, headers: req.headers })
  return client.fetch(retry)
})
```

### Error interceptor

Receives the thrown error (and the `Request`). Must return the (possibly modified) error. The client always rethrows after running error interceptors.

```ts
client.interceptors.error.use((err, _res, req) => {
  logger.error('Network failure', { url: req.url, err })
  return err
})
```

---

## Managing interceptors

```ts
// Add — returns a numeric id
const id = client.interceptors.request.use(myFn)

// Remove by id or by function reference
client.interceptors.request.eject(id)
client.interceptors.request.eject(myFn)

// Replace
client.interceptors.request.update(id, newFn)

// Check if still registered
client.interceptors.request.exists(id)
client.interceptors.request.exists(myFn)

// Remove all
client.interceptors.request.clear()
```

---

## Recipes

### OAuth Bearer token

```ts
const client = createClient({ baseUrl: 'https://api.example.com' })

client.interceptors.request.use(async (req) => {
  const token = await tokenStore.get()
  req.headers.set('Authorization', `Bearer ${token}`)
  return req
})
```

### Token refresh on 401

```ts
let refreshing = false

client.interceptors.response.use(async (res, req) => {
  if (res.status !== 401 || refreshing) return res

  refreshing = true
  await tokenStore.refresh()
  refreshing = false

  const retry = new Request(req.url, { method: req.method, headers: req.headers })
  return client.fetch(retry)
})
```

### Request tracing

```ts
client.interceptors.request.use((req) => {
  req.headers.set('X-Request-Id', crypto.randomUUID())
  req.headers.set('X-Trace-Id', traceContext.current())
  return req
})
```

### Error logging

```ts
client.interceptors.error.use((err, _res, req) => {
  logger.error({ url: req.url, err })
  return err
})
```

---

## Using interceptors standalone

If you have your own fetch wrapper and only need the interceptor pipeline:

```ts
import { createInterceptors } from '@wisemen/node-fetch'

const interceptors = createInterceptors<Request, Response, unknown, Request>()

async function send(request: Request): Promise<Response> {
  for (const fn of interceptors.request.fns) {
    if (fn) request = await fn(request, request)
  }

  let response: Response
  try {
    response = await fetch(request)
  }
  catch (error) {
    let finalError: unknown = error
    for (const fn of interceptors.error.fns) {
      if (fn) finalError = await fn(error, undefined as any, request, request)
    }
    throw finalError
  }

  for (const fn of interceptors.response.fns) {
    if (fn) response = await fn(response, request, request)
  }

  return response
}
```
