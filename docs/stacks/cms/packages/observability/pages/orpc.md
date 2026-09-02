---
title: oRPC requests
---

# oRPC requests

The oRPC helpers add bounded RPC input, a minimal caller identity, and the
active trace identifiers to Evlog's request-wide event.

## Configure the procedure middleware

```ts
import {
  initializeOrpcLogging,
  orpcLoggingMiddleware,
} from '@wisemen/payload-core-observability'

initializeOrpcLogging({
  environment: process.env.NODE_ENV,
  service: 'cms-api',
})

const base = os.use(orpcLoggingMiddleware)
```

`initializeOrpcLogging()` initializes Evlog and returns the middleware, so you
can also pass its return value directly to `os.use()`.

Your oRPC context may include an optional `user` object with `id` and `role`.
Only those fields are copied to the log event.

```ts
type Context = {
  user: {
    id: string
    role?: string | null
  } | null
}
```

## Wrap the Fetch handler

Use `withOrpcLogging()` around the oRPC Fetch handler. This starts and emits
the request-wide Evlog event.

```ts
import { RPCHandler } from '@orpc/server/fetch'
import {
  orpcLoggingOptions,
  withOrpcLogging,
} from '@wisemen/payload-core-observability'

const handler = withOrpcLogging(
  new RPCHandler(router),
  orpcLoggingOptions,
)
```

The middleware records `rpc.operation`, bounded `rpc.input`, and the user
context. If a procedure throws, it records the error, then rethrows it so oRPC
can produce its normal response.

## Trace correlation

When an OpenTelemetry span is active, the event also receives `trace_id`,
`span_id`, and `trace_flags`. Use these identifiers to navigate from a slow or
failed request event to the matching trace in your observability backend.
