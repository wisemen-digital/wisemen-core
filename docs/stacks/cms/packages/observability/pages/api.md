---
title: API reference
---

# API reference

All APIs are exported from `@wisemen/payload-core-observability`.

## Logging

| Export | Purpose |
| --- | --- |
| `initializeLogging(options)` | Initializes Evlog with environment, service, redaction, and sampling configuration. |
| `createApplicationLogger()` | Creates one application Evlog event tagged with `eventSource: 'application'`. |
| `resolveLoggingSampling(slowRequest, overrides)` | Returns the resolved Evlog sampling policy. Useful for testing configuration. |
| `resolveSlowRequestOptions(options)` | Applies the 3-second default and validates the duration. |
| `getSlowRequestOptions()` | Returns the current resolved slow-event threshold. |
| `limitLoggingValue(value)` | Bounds untrusted input before it is attached to a log event. |
| `loggingRedaction` | The default Evlog redaction paths. |
| `SLOW_REQUEST_KEEP_MS` | Default slow-event threshold: `3000`. |

`InitializeLoggingOptions` requires `service`, and accepts `environment`,
`sampling`, and `slowRequest.durationMs`. `ApplicationLogFields` describes the
standard `eventSource` field on application events.

## Payload jobs

| Export | Purpose |
| --- | --- |
| `withJobLogging(definition, type)` | Wraps one Payload task/workflow definition. |
| `withJobLogging(definitions, type)` | Wraps an array of definitions. |
| `JobOperationType` | `'task'` or `'workflow'`. |

## oRPC

| Export | Purpose |
| --- | --- |
| `initializeOrpcLogging(options)` | Initializes Evlog and returns the oRPC middleware. |
| `orpcLoggingMiddleware` | Adds RPC, user, and trace context to the current request event. |
| `withOrpcLogging` | Evlog's oRPC Fetch-handler wrapper. |
| `orpcLoggingOptions` | The wrapper options using the default redaction policy. |
| `LoggingUser` | Minimal logged user shape: `id` and optional `role`. |
| `OrpcLoggingContext` | Evlog oRPC context type. |

## OpenTelemetry

| Export | Purpose |
| --- | --- |
| `initializeOpenTelemetry(options)` | Starts OTLP tracing once when an endpoint is configured. |
| `getActiveTraceLogContext()` | Returns current `trace_id`, `span_id`, and `trace_flags`, if a valid span is active. |
| `InitializeOpenTelemetryOptions` | Requires `serviceName`; accepts an optional `environment`. |
