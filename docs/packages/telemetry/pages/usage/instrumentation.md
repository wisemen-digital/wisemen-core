# Instrumentation

OpenTelemetry tracing works best with automatic instrumentations. `telemetry.init(app)` already registers the default Fetch and User Interaction instrumentations once.

Metrics use the same bootstrap path. When `metricsEndpoint` is configured, `telemetry.init(app)` also initializes the global OTEL meter provider so instrumentations or application code can emit metrics through it.

## Defaults

The default setup includes:

- Fetch instrumentation with trace headers propagated to all CORS URLs
- User Interaction instrumentation for `click`, `change`, and `keydown` events

## Add extra instrumentations

If you need more instrumentations for other libraries (for example document load or web vitals), pass them to `registerAppInstrumentations()`. The defaults remain registered only once.

```typescript
import { registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'

registerAppInstrumentations([
  new DocumentLoadInstrumentation(),
])
```
