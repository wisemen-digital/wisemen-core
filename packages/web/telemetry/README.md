# @wisemen/vue-core-telemetry

A lightweight helper that wires Sentry error tracking and OpenTelemetry tracing into Vue applications with a single interface.

## Highlights
- Initialize Sentry and OpenTelemetry with one `Telemetry` instance.
- Capture exceptions or custom messages and enrich them with tags, extras, and user context.
- Ship OTLP traces with automatic Fetch/User Interaction instrumentations and custom ones via `registerAppInstrumentations`.
- Ship build metadata (commit, build number, environment) with every span.

## Installation

```bash
pnpm i @wisemen/vue-core-telemetry
```

This package peers on Vue, so ensure the app already depends on `vue`.

## Basic usage

```ts
// src/plugins/telemetry.plugin.ts
import { Telemetry, registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import type { App } from 'vue'

import {
  CURRENT_BUILD_COMMIT,
  CURRENT_BUILD_NUMBER,
  CURRENT_BUILD_TIMESTAMP,
  CURRENT_ENVIRONMENT,
  OTEL_SERVICE_NAME,
  OTEL_TRACE_ENDPOINT,
  SENTRY_DSN,
  SENTRY_SAMPLE_RATE,
} from '@/constants/environment.constant'
import { oAuthClient } from '@/libs/oAuth.lib'

const telemetry = new Telemetry({
  openTelemetry: {
    accessTokenFn: () => oAuthClient.getAccessToken(),
    buildNumber: CURRENT_BUILD_NUMBER,
    buildTimestamp: CURRENT_BUILD_TIMESTAMP,
    commitHash: CURRENT_BUILD_COMMIT,
    environment: CURRENT_ENVIRONMENT,
    serviceName: OTEL_SERVICE_NAME ?? 'vue-template',
    traceEndpoint: OTEL_TRACE_ENDPOINT,
  },
  sentry: {
    dsn: SENTRY_DSN,
    sampleRate: SENTRY_SAMPLE_RATE,
  },
})

registerAppInstrumentations() // optional: register default Fetch & User Interaction instrumentations

export const telemetryPlugin = {
  install: async (app: App) => {
    if (CURRENT_ENVIRONMENT === 'mock' || CURRENT_BUILD_COMMIT === 'undefined') return
    await telemetry.init(app)
  },
}
```

Once initialized you can call the helper anywhere (e.g. inside error boundaries, composables, or stores) to report diagnostics:

```ts
telemetry.captureException(error, { feature: 'checkout' })
telemetry.setTags({ locale: 'en-GB' })
telemetry.setUser({ id: user.id, email: user.email })
```

## Configuration reference

The `Telemetry` constructor accepts the following options:

| Option | Description |
| --- | --- |
| `sentry?: SentryOptions` | Enables Sentry error reporting. Requires at least a `dsn`. |
| `openTelemetry?: OpenTelemetryOptions` | Enables OTLP trace exporting. Requires a `serviceName`, `traceEndpoint`, and `accessTokenFn`. |

### `SentryOptions`

| Property | Type | Notes |
| --- | --- | --- |
| `dsn` | `string` | Required DSN for your Sentry project. |
| `enabled` | `boolean` | Default `true`. Skip initialization when `false`. |
| `debug` | `boolean` | Logs verbose warnings in development. |
| `environment` | `string` | Defaults to `"production"`. |
| `sampleRate` | `number` | Event sampling rate (`1.0` = 100%). |
| `enableReplays` | `boolean` | Enables session replays. |
| `replaysSessionSampleRate` | `number` | Default `0.1`. |
| `replaysOnErrorSampleRate` | `number` | Default `1`. |

### `OpenTelemetryOptions`

| Property | Type | Notes |
| --- | --- | --- |
| `accessTokenFn` | `() => Promise<string>` | Must resolve to a valid bearer token for the OTLP endpoint. Called before every batch export. |
| `traceEndpoint` | `string` | URL of the OTLP/HTTP trace collector. Required to enable tracing. |
| `serviceName` | `string` | Telemetry service identifier (e.g. app name). |
| `environment`, `buildNumber`, `buildTimestamp`, `commitHash`, `serviceVersion` | `string` | Optional metadata that is attached to every span. |
| `debug` | `boolean` | Emits logs while initializing. |
| `enabled` | `boolean` | Disable tracing entirely when set to `false`. |

## Registering additional instrumentations

The helper exports `registerAppInstrumentations` which registers sensible defaults (Fetch + User Interaction). Pass extra instrumentations if your application needs to instrument other libraries:

```ts
import { registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'

registerAppInstrumentations([
  new DocumentLoadInstrumentation(),
])
```

## API surface

- `telemetry.init(app)` – bootstraps Sentry and/or OpenTelemetry using the provided options.
- `captureException(error, context?)` – forwards errors to Sentry, optionally with structured context.
- `captureMessage(message, level?)` – log arbitrary messages with a Sentry severity level.
- `setExtra(key, value)` / `setTag(key, value)` / `setTags(record)` / `setUser(user)` – enrich subsequent events with extra fields.
- `registerAppInstrumentations(instrumentations?)` – helper for OpenTelemetry instrumentation setup (also exported separately).

Refer to the [`vue-project-template`](https://github.com/wisemen-digital/vue-project-template) for a fully wired example plugin and environment setup.
