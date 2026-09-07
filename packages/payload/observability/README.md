# @wisemen/payload-core-observability

Payload-oriented logging and OpenTelemetry helpers.

## Logging and jobs

Initialize Evlog once in each runtime, then wrap Payload task or workflow
definitions with `withJobLogging()`. It accepts a single definition or an
array, preserves the configuration type, emits one wide event per execution,
and records failures at `error`. Successful job events follow Evlog sampling;
slow events are retained by the default 3-second tail-sampling rule.

```ts
import {
  initializeLogging,
  withJobLogging,
} from '@wisemen/payload-core-observability'

initializeLogging({
  service: 'my-worker',
  sampling: {
    rates: {
      info: 1,
    },
  },
})

export default withJobLogging(tasks, 'task')
```

`initializeLogging()` configures Evlog redaction for common credential keys,
and `limitLoggingValue()` only bounds size and depth before values are attached
to an event.

## Application events

Use `createApplicationLogger()` for an application-level event. It creates a
new Evlog event with `eventSource: 'application'`, retains the shared Evlog
configuration, and does not share mutable event context between concurrent
operations. Add structured context only when it is useful.

```ts
import { createApplicationLogger } from '@wisemen/payload-core-observability'

const log = createApplicationLogger()

try {
  log.set({
    invoiceId,
    operation: 'invoice.send',
  })
  log.info('Sending invoice')
  await sendInvoice(invoiceId)
}
catch (error) {
  log.error(error instanceof Error ? error : String(error))
  throw error
}
finally {
  log.emit()
}
```

## oRPC

```ts
import {
  initializeOrpcLogging,
  orpcLoggingOptions,
  withOrpcLogging,
} from '@wisemen/payload-core-observability'
```

## OpenTelemetry

Use `initializeOpenTelemetry()` only from a Node runtime instrumentation entry
point. It enables OTLP traces when an OTLP endpoint is configured and adds
HTTP, Postgres, and oRPC instrumentation.

```ts
import { initializeOpenTelemetry } from '@wisemen/payload-core-observability'
```
