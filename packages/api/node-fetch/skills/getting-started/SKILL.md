---
name: getting-started
description: Create an HTTP client with interceptors. Use when making authenticated HTTP requests from a NestJS service.
---

# @wisemen/node-fetch — Getting Started

Use `createClient` to get a fetch wrapper with a typed interceptor pipeline.
All HTTP methods return a native `Response`. Non-2xx responses are never thrown.

## Create a client

```ts
import { createClient } from '@wisemen/node-fetch'

const client = createClient({
  baseUrl: 'https://api.example.com',
  headers: { 'X-App': 'my-app' },
})
```

## Attach a Bearer token (request interceptor)

```ts
client.interceptors.request.use(async (req) => {
  const token = await tokenStore.get()
  req.headers.set('Authorization', `Bearer ${token}`)
  return req
})
```

## Refresh token on 401 (response interceptor)

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

## Log errors (error interceptor)

```ts
client.interceptors.error.use((err, _res, req) => {
  logger.error({ url: req.url, err })
  return err
})
```

## Make requests

```ts
const res = await client.get('/users')
const data = await res.json()

await client.post('/users', {
  body: JSON.stringify({ name: 'Alice' }),
  headers: { 'Content-Type': 'application/json' },
})

await client.delete('/users/1')
```

## Manage interceptors

```ts
const id = client.interceptors.request.use(myFn)

client.interceptors.request.eject(id)      // remove by id
client.interceptors.request.eject(myFn)    // remove by reference
client.interceptors.request.update(id, newFn)
client.interceptors.request.exists(id)
client.interceptors.request.clear()        // remove all
```
