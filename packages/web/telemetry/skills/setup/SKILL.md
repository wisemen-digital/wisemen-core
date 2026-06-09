---
name: telemetry-setup
description: Initialize `@wisemen/vue-core-telemetry` — construct a `Telemetry` instance with OpenTelemetry tracing/metrics/logging options, call `telemetry.init(app)` (which auto-captures Vue component errors and browser unhandled errors), then use `recordException()`, `setUser()`, `log()`, `setAttributes()`, and `registerAppInstrumentations()`. Use this whenever adding observability to a Vue app, reporting errors/metrics/logs to an OTLP backend, or setting user context and custom span attributes.
---

# @wisemen/vue-core-telemetry — Setup

## Import

```ts
import { Telemetry } from '@wisemen/vue-core-telemetry'
import type { TelemetryOptions, TelemetryUser } from '@wisemen/vue-core-telemetry'
```

## Quick Start

### 1. Create the instance

```ts
// telemetry.ts
import { Telemetry } from '@wisemen/vue-core-telemetry'
import { oAuthClient } from '@/auth'

export const telemetry = new Telemetry({
  accessTokenFn: () => oAuthClient.getAccessToken(),
  serviceName: 'my-app',
  traceEndpoint: import.meta.env.VITE_OTEL_TRACE_ENDPOINT,
  metricsEndpoint: import.meta.env.VITE_OTEL_METRICS_ENDPOINT,
  logEndpoint: import.meta.env.VITE_OTEL_LOG_ENDPOINT,
  tracePropagationUrls: [import.meta.env.VITE_API_BASE_URL],
  traceSampleRate: 1,
  environment: import.meta.env.VITE_ENVIRONMENT,
  serviceVersion: import.meta.env.VITE_APP_VERSION,
  enabled: import.meta.env.PROD,
})
```

### 2. Initialize with your Vue app

```ts
// main.ts
import { createApp } from 'vue'
import { telemetry } from '@/telemetry'
import App from './App.vue'

const app = createApp(App)
await telemetry.init(app)
app.mount('#app')
```

This automatically:
- Sets up trace, metrics, and log exporters to your OTLP endpoints
- Registers Fetch and UserInteraction instrumentations
- Propagates trace headers only to same-origin requests and configured `tracePropagationUrls`
- Installs Vue error handler and browser error handlers

## Examples

### Record application errors

```ts
try {
  await checkout(cart)
} catch (error) {
  telemetry.recordException(error, { feature: 'checkout' })
}
```

### Set user context after login

```ts
telemetry.setUser({ id: user.id, email: user.email })
```

### Log operational events

```ts
telemetry.log('checkout started', { severity: 'info' })
telemetry.log('payment failed', { severity: 'error' })
```

### Set shared attributes

```ts
telemetry.setAttributes({ locale: 'en-GB', tenant: 'acme' })
```

### Register additional instrumentations

```ts
import { registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'

registerAppInstrumentations({
  tracePropagationUrls: [import.meta.env.VITE_API_BASE_URL],
  instrumentations: [new XMLHttpRequestInstrumentation()],
})
```

Cross-origin APIs that receive trace headers must allow `traceparent` and
`tracestate` in CORS. Pass `tracePropagationUrls: []` to disable cross-origin
trace header propagation.

## Skill metadata

- **Library:** `@wisemen/vue-core-telemetry` (package `vue-core-telemetry`)
- **Type:** core
- **Authored against:** v2.0.0
- **Sources:** (read these for full API details)
  - `packages/web/telemetry/src/index.ts` — `Telemetry` class
  - `packages/web/telemetry/src/types.ts` — options & types
  - `packages/web/telemetry/src/opentelemetry/tracing/tracer.ts`
  - `packages/web/telemetry/src/opentelemetry/metrics/meter.ts`
  - `packages/web/telemetry/src/opentelemetry/logging/logger.ts`
