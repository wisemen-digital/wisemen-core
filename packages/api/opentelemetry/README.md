# Opentelemetry Package for TypeScript

## Features

coming soon...

## Philosophy

coming soon...

## Example

```ts
import { SpanStatusCode } from '@opentelemetry/api'
import { configureOpentelemetryTracing } from '@wisemen/opentelemetry'

const sdk = configureOpentelemetryTracing({
  serviceName: 'api',
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  shouldExportSpan: span => {
    const isSuccessfulRedisPing = span.name === '[Redis] PING'
      && span.status.code !== SpanStatusCode.ERROR

    return !isSuccessfulRedisPing
  }
})
```

`shouldExportSpan` runs when a span ends and before it enters the batch export queue. Returning
`false` prevents the span from being sent to the OpenTelemetry collector. The example continues to
export failed Redis pings so they remain visible for troubleshooting.

## Deep Dive

coming soon...
