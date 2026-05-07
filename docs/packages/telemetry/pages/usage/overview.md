# Overview

`Telemetry` initializes OpenTelemetry traces and logs behind one interface. Pass the options you need and call `telemetry.init(app)` during boot.

## Configure providers

- Set `serviceName` and `accessTokenFn` (returns a bearer token).
- Add `traceEndpoint` to export traces and `logEndpoint` to export OTEL log records.
- Add metadata like `environment`, `buildNumber`, `buildTimestamp`, or `commitHash` to attach context to every span and log record.
- Disable telemetry entirely with `enabled: false`.

```typescript
import { Telemetry } from '@wisemen/vue-core-telemetry'

const telemetry = new Telemetry({
  accessTokenFn: () => authClient.getAccessToken(), // return a bearer token for OTLP exports
  serviceName: 'vue-app',
  traceEndpoint: import.meta.env.VITE_OTEL_TRACE_ENDPOINT,
  logEndpoint: import.meta.env.VITE_OTEL_LOG_ENDPOINT,
  environment: import.meta.env.MODE,
  commitHash: import.meta.env.VITE_GIT_COMMIT,
})

await telemetry.init(app)
```

## Report errors and messages

```typescript
telemetry.recordException(error, { feature: 'checkout', step: 'confirm' })
telemetry.log('checkout started', { severity: 'info' })
```

## Add context for future events

```typescript
telemetry.setAttributes({ locale: 'en-GB', plan: 'pro' })
telemetry.setAttribute('cartSize', 4)
telemetry.setUser({ id: user.id, email: user.email })
```
