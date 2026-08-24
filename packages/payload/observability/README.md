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
