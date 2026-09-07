---
name: getting-started
description: Use when bootstrapping OpenTelemetry tracing, metrics, or OTLP-backed application logging in a NestJS service.
---

# @wisemen/opentelemetry - Getting Started

Use this package to start tracing and metrics explicitly at application startup,
decorate important method boundaries with `@Trace()`, and emit OTLP logs without
letting the package read process environment variables on its own.

## Start Tracing And Metrics At Bootstrap

Pass runtime values explicitly from the application boundary. `enabled: false`
or an empty `url` turns each pipeline into a no-op.

```ts
import {
  startOpentelemetryTracing
  startOpentelemetryMetrics
} from '@wisemen/opentelemetry'

startOpentelemetryTracing({
  enabled: true,
  serviceName: 'api',
  env: 'production',
  url: 'https://signoz.example/v1/traces',
  auth: {
    type: 'basic',
    key: 'token'
  },
  attributes: {
    'service.namespace': 'billing'
  }
})

startOpentelemetryMetrics({
  enabled: true,
  serviceName: 'api',
  env: 'production',
  url: 'https://signoz.example/v1/metrics',
  auth: {
    type: 'basic',
    key: 'token'
  }
})
```

`startOpentelemetryTracing(...)` registers the package's default HTTP, Nest,
Express, Postgres, Redis, AWS SDK, and Undici instrumentations before starting
the Node SDK.

Use `registerInstrumentation(...)` directly only when the application needs to
add extra OpenTelemetry instrumentations beyond that default set.

## Create Spans Around Significant Boundaries

Apply `@Trace()` to methods that should start a dedicated span, such as calls to
external systems or major subsystem boundaries.

```ts
import { Trace } from '@wisemen/opentelemetry'

export class SyncInvoiceUseCase {
  @Trace()
  async execute (): Promise<void> {
    // ...
  }
}
```

Use `getOtelTracer()` when manual span creation is clearer than a decorator.

## Capture Exceptions Without Rethrowing

Use `captureException(...)` when the error should be recorded on the active span
but handled locally.

```ts
import { captureException } from '@wisemen/opentelemetry'

try {
  await riskyOperation()
} catch (error) {
  captureException(error, 'Failed to process payment')
}
```

## Emit OTLP Logs

Use `OpenTelemetryLogger` directly in non-Nest code, or register
`OtelLoggerModule.forRoot(...)` and inject `NestjsOtelLogger` inside Nest
modules.

```ts
import { OpenTelemetryLogger } from '@wisemen/opentelemetry'

const logger = new OpenTelemetryLogger({
  serviceName: 'api',
  env: 'production',
  url: 'https://signoz.example/v1/logs',
  auth: {
    type: 'basic',
    key: 'token'
  }
})

logger.info({
  context: 'InvoiceSyncJob',
  body: { invoiceId: 'inv_123', status: 'started' }
})
```
