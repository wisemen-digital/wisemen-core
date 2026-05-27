# Instrumentation

OpenTelemetry tracing works best with automatic instrumentations. `telemetry.init(app)` already registers the default Fetch and User Interaction instrumentations once.

Metrics use the same bootstrap path. When `metricsEndpoint` is configured, `telemetry.init(app)` also initializes the global OTEL meter provider so instrumentations or application code can emit metrics through it.

## Defaults

The default setup includes:

- Fetch instrumentation with trace headers propagated only to configured URLs
- User Interaction instrumentation for `click`, `change`, and `keydown` events

Configure trace propagation through `Telemetry`:

```typescript
const telemetry = new Telemetry({
  accessTokenFn: () => authClient.getAccessToken(),
  serviceName: 'vue-app',
  tracePropagationUrls: [
    import.meta.env.VITE_API_URL,
    /^https:\/\/api\.example\.com\/v2(?:$|[/?#])/,
  ],
})
```

String values are treated as URL prefixes. Use regular expressions when you need custom matching. Only include APIs that allow the `traceparent` header in CORS preflight responses.

## Add extra instrumentations

If you need more instrumentations for other libraries (for example document load or web vitals), pass them to `registerAppInstrumentations()`. The defaults remain registered only once.

```typescript
import { registerAppInstrumentations } from '@wisemen/vue-core-telemetry'
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load'

registerAppInstrumentations({
  tracePropagationUrls: [import.meta.env.VITE_API_URL],
  instrumentations: [new DocumentLoadInstrumentation()],
})
```
