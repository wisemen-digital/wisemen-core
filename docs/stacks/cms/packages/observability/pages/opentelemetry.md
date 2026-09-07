---
title: OpenTelemetry
---

# OpenTelemetry

`initializeOpenTelemetry()` starts the OpenTelemetry Node SDK when an OTLP
endpoint is configured. It is safe to call more than once: only the first call
starts the SDK.

```ts
import { initializeOpenTelemetry } from '@wisemen/payload-core-observability'

initializeOpenTelemetry({
  environment: process.env.NODE_ENV,
  serviceName: 'cms',
})
```

## Enable trace export

Set either standard OTLP environment variable:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel.example.com
# or
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=https://otel.example.com/v1/traces
```

If neither is configured, initialization does nothing. This makes the same
application configuration safe in local development and environments without
an OTLP collector.

`OTEL_SERVICE_NAME`, when set, overrides the `serviceName` option. The optional
`environment` option is published as `deployment.environment.name`.

## Included instrumentation

The SDK registers:

- HTTP instrumentation
- PostgreSQL instrumentation
- oRPC instrumentation
- The OTLP HTTP trace exporter

The active span is exposed to the oRPC logging middleware through
`getActiveTraceLogContext()`, which adds trace correlation fields to the Evlog
event.

## Next.js and Edge runtimes

The SDK installs Node process signal handlers and uses Node APIs. Keep it out
of Edge code. In Next.js, split instrumentation so the Edge entrypoint never
statically imports this package:

```ts
// instrumentation.ts
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
```

```ts
// instrumentation.node.ts
import { initializeOpenTelemetry } from '@wisemen/payload-core-observability'

initializeOpenTelemetry({
  serviceName: 'cms',
})
```
