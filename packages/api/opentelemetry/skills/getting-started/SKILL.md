---
name: getting-started
description: OpenTelemetry for NestJS applications. Use when distributed tracing is needed, and when capturing exceptions.
---

## Import

```ts
import { configureOpentelemetryTracing, configureOpentelemetryMetrics, Trace, captureException, getOtelTracer, registerInstrumentation, OpenTelemetryLogger } from '@wisemen/opentelemetry' 
```

### Startup configuration

Pass all runtime values explicitly when starting tracing or metrics. The package
does not read environment variables.

```ts
import {
  getOtlpExporterHeaders,
  startOpentelemetryTracing
} from '@wisemen/opentelemetry'

startOpentelemetryTracing({
  enabled: true,
  serviceName: 'api',
  env: 'production',
  url: 'https://signoz.example/v1/traces',
  headers: getOtlpExporterHeaders({
    auth: 'basic',
    key: 'token'
  })
})
```


### Add @Trace() to methods that require a new spans. Use when starting a significant call to for example an external system or subsystem.

```ts
  @Trace()
  async execute (): Promise<void> {
    ...
  }
```

### Capture exceptions. Use when an error does not need to be thrown.

```ts
import { captureException } from '@wisemen/opentelemetry'

try {
  await riskyOperation()
} catch (error) {
  captureException(error, 'Failed to process payment')
}
```
