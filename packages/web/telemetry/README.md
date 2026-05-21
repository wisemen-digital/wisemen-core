# @wisemen/vue-core-telemetry

A lightweight helper that wires OpenTelemetry tracing, metrics, and logging into Vue applications with a single interface.

## Highlights
- Initialize OTEL traces, OTEL metrics, and OTEL logs with one `Telemetry` instance.
- Record exceptions, custom log messages, and Vue/browser runtime errors with OTEL-native data.
- Enrich spans and log records with shared attributes and user context.
- Ship OTLP traces with automatic Fetch/User Interaction instrumentations and custom ones via `registerAppInstrumentations`.

## What This Package Is For

This package exists to give Vue applications one consistent telemetry setup instead of having every project hand-roll its own OpenTelemetry bootstrap.

Use it when you want:

- a single `telemetry.init(app)` step during app startup
- automatic browser instrumentation for the most common frontend signals
- a simple API for application errors, logs, and user context
- consistent OTEL resource metadata such as environment, build, and commit information

In practice, this package covers three concerns:

- **Tracing**: spans for requests, user interactions, and manual application events
- **Metrics**: OTEL meter provider setup for application metrics and metric-producing instrumentations
- **Logging**: OTEL log records for operational messages and error events
- **Error capture**: Vue errors, browser global errors, promise rejections, and manual exception reporting

## Why The Default Behavior Exists

- **`telemetry.init(app)` registers default instrumentations** so every consumer gets the same baseline tracing behavior without extra setup.
- **Fetch instrumentation** is enabled because frontend backends are usually the most important dependency to trace.
- **User Interaction instrumentation** is enabled so traces can be correlated with real user actions such as clicks and form changes.
- **Vue and browser error handlers** are installed because runtime failures are one of the highest-value frontend telemetry signals.
- **Shared attributes and user context** exist so spans and logs can be filtered by tenant, locale, plan, environment, or authenticated user.

## Installation

```bash
pnpm i @wisemen/vue-core-telemetry
```

This package peers on Vue, so ensure the app already depends on `vue`.

## Basic usage

```ts
// src/plugins/telemetry.plugin.ts
import { Telemetry } from '@wisemen/vue-core-telemetry'
import type { App } from 'vue'

import {
  CURRENT_BUILD_COMMIT,
  CURRENT_BUILD_NUMBER,
  CURRENT_BUILD_TIMESTAMP,
  CURRENT_ENVIRONMENT,
  OTEL_LOG_ENDPOINT,
  OTEL_METRICS_ENDPOINT,
  OTEL_SERVICE_NAME,
  OTEL_TRACE_ENDPOINT,
} from '@/constants/environment.constant'
import { oAuthClient } from '@/libs/oAuth.lib'

const telemetry = new Telemetry({
  accessTokenFn: () => oAuthClient.getAccessToken(),
  buildNumber: CURRENT_BUILD_NUMBER,
  buildTimestamp: CURRENT_BUILD_TIMESTAMP,
  commitHash: CURRENT_BUILD_COMMIT,
  environment: CURRENT_ENVIRONMENT,
  logEndpoint: OTEL_LOG_ENDPOINT,
  metricsEndpoint: OTEL_METRICS_ENDPOINT,
  serviceName: OTEL_SERVICE_NAME ?? 'vue-template',
  traceEndpoint: OTEL_TRACE_ENDPOINT,
})

export const telemetryPlugin = {
  install: async (app: App) => {
    if (CURRENT_ENVIRONMENT === 'mock' || CURRENT_BUILD_COMMIT === 'undefined') return
    await telemetry.init(app)
  },
}
```

Once initialized you can call the helper anywhere (e.g. inside error boundaries, composables, or stores) to report diagnostics:

```ts
telemetry.recordException(error, { feature: 'checkout' })
telemetry.setAttributes({ locale: 'en-GB' })
telemetry.setUser({ id: user.id, email: user.email })
telemetry.log('checkout started', {
  severity: 'info',
})
```

## How To Think About The API

- Use `recordException()` for failures that should be visible in both traces and logs.
- Use `log()` for operational messages such as workflow milestones or non-fatal warnings.
- Use `setAttribute()` / `setAttributes()` for stable context that should apply to later events.
- Use `setUser()` after authentication so later logs and exceptions can be tied to an end user.

## Configuration reference

The `Telemetry` constructor accepts the following options:

| Property | Type | Notes |
| --- | --- | --- |
| `accessTokenFn` | `() => Promise<string>` | Must resolve to a valid bearer token for the OTLP endpoint. Called before every batch export. |
| `traceEndpoint` | `string` | URL of the OTLP/HTTP trace collector. Enables tracing when provided. |
| `metricsEndpoint` | `string` | URL of the OTLP metric collector. Initializes the OTEL meter provider when provided. |
| `logEndpoint` | `string` | URL of the OTLP/HTTP log collector. Enables OTEL logs when provided. |
| `serviceName` | `string` | Telemetry service identifier (e.g. app name). |
| `environment`, `buildNumber`, `buildTimestamp`, `commitHash`, `serviceVersion` | `string` | Optional metadata that is attached to every span and log record. |
| `debug` | `boolean` | Emits logs while initializing. |
| `enabled` | `boolean` | Disable telemetry entirely when set to `false`. |

## Registering additional instrumentations

`telemetry.init(app)` automatically registers the default Fetch and User Interaction instrumentations once. If your application needs extra instrumentations, use `registerAppInstrumentations` to append them:

```ts
import { registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'

registerAppInstrumentations([
  new DocumentLoadInstrumentation(),
])
```

## API surface

- `telemetry.init(app)` – bootstraps OTEL traces/metrics/logs, registers default Fetch/User Interaction instrumentations once, and installs Vue/browser runtime error handlers.
- `recordException(error, attributes?)` – records the exception on the active span and emits an OTEL error log when logging is configured.
- `log(message, options?)` – emits an OTEL log record or falls back to a span event when no logger is configured.
- `setAttribute(key, value)` / `setAttributes(record)` / `setUser(user)` – enrich subsequent logs and exceptions with shared attributes.
- `registerAppInstrumentations(instrumentations?)` – helper for adding extra instrumentations beyond the defaults.

## When To Configure Which Endpoint

- Configure `traceEndpoint` when you want distributed tracing and request/user-interaction visibility.
- Configure `metricsEndpoint` when you want OTEL metrics exported from frontend metric instruments or metric-producing instrumentations.
- Configure `logEndpoint` when you want frontend logs and exception events to be queryable as logs.
- Configure all three when you want the full package behavior.

If only `traceEndpoint` is configured, `log()` still records span events when tracing is active.

`metricsEndpoint` only configures the export pipeline. Metrics are emitted when your application or a library creates OTEL metric instruments through the global meter provider.

Refer to the [`vue-project-template`](https://github.com/wisemen-digital/vue-project-template) for a fully wired example plugin and environment setup.
