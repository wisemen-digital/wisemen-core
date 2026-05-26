# Installation

`@wisemen/vue-core-telemetry` wires OpenTelemetry tracing, metrics, and logging into Vue apps with a single helper.

## Prerequisites

- Vue 3 application
- OTLP trace, metrics, and/or log endpoints
- A function that returns a bearer token for OTLP exports

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-telemetry
```
:::

## 2. Create a telemetry plugin

Configure OpenTelemetry once. Skip initialization when you do not want telemetry locally.

```typescript
// src/plugins/telemetry.plugin.ts
import { Telemetry } from '@wisemen/vue-core-telemetry'
import type { App } from 'vue'

const telemetry = new Telemetry({
  accessTokenFn: () => authClient.getAccessToken(), // return a bearer token for OTLP exports
  serviceName: 'vue-app',
  traceEndpoint: import.meta.env.VITE_OTEL_TRACE_ENDPOINT,
  metricsEndpoint: import.meta.env.VITE_OTEL_METRICS_ENDPOINT,
  logEndpoint: import.meta.env.VITE_OTEL_LOG_ENDPOINT,
  environment: import.meta.env.MODE,
  buildNumber: import.meta.env.VITE_BUILD_NUMBER,
  commitHash: import.meta.env.VITE_GIT_COMMIT,
})

export const telemetryPlugin = {
  install: async (app: App) => {
    if (import.meta.env.MODE === 'mock') {
        return
    }
    
    await telemetry.init(app)
  },
}
```

`metricsEndpoint` initializes the global OTEL meter provider. That is required if your app or one of its libraries will create counters, histograms, or other OTEL metrics in the browser.

## 3. Install the plugin during app bootstrap

```typescript
// src/main.ts
import { telemetryPlugin } from './plugins/telemetry.plugin'

const app = createApp(App)

app.use(telemetryPlugin)
app.mount('#app')
```
