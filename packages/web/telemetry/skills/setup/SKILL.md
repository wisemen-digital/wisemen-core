---
name: telemetry-setup
description: >
  Initialize Telemetry with OpenTelemetry tracing, metrics, and logging.
  Covers setup with Vue app, error recording, user context, logging,
  and custom attributes. Auto-captures Vue component errors and browser
  unhandled errors.
type: core
library: vue-core-telemetry
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

registerAppInstrumentations([new XMLHttpRequestInstrumentation()])
```

## Source Files

For full API details, read the source files.

- Telemetry class: `src/index.ts`
- Types: `src/types.ts`
- Tracing: `src/opentelemetry/tracing/tracer.ts`
- Metrics: `src/opentelemetry/metrics/meter.ts`
- Logging: `src/opentelemetry/logging/logger.ts`
