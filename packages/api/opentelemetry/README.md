# Opentelemetry Package for TypeScript

## Features

coming soon...

## Philosophy

coming soon...

## Example

```ts
import { SpanStatusCode } from '@opentelemetry/api'
import { startOpentelemetryTracing } from '@wisemen/opentelemetry'

startOpentelemetryTracing({
  enabled: true,
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

## Trace volume reduction

Trace volume reduction is built in. It:

- suppresses incoming `/health` and `/ready` requests;
- suppresses outgoing HTTP and Undici requests to `uptime.betterstack.com`;
- drops successful PostgreSQL `START`, `COMMIT`, `SAVEPOINT`, `RELEASE`, and
  `ROLLBACK` spans;
- replaces SQL text on successful PostgreSQL queries faster than 500 ms with a
  low-cardinality `db.query.summary` generated from the query's PostgreSQL AST.

Slow and failed PostgreSQL spans keep their SQL text. Unsupported SQL never
affects query execution: the parser omits the summary, and routine SQL text is
still removed at export time. A summary contains only ordered operations and
relation names; `db.collection.name` is set only when one relation is
unambiguous.

Built-in volume reduction runs before `shouldExportSpan`, so the callback sees
the final attributes that would be exported.

## Deep Dive

coming soon...
