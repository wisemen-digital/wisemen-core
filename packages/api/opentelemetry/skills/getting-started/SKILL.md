---
name: getting-started
description: >
  Configure OTLP tracing with configureOpentelemetryTracing(), add @Trace() to methods
  for automatic span creation, and capture exceptions with captureException().
type: lifecycle
library: opentelemetry
exports:
  - configureOpentelemetryTracing
  - configureOpentelemetryMetrics
  - Trace
  - captureException
  - getOtelTracer
  - registerInstrumentation
  - OpenTelemetryLogger
---

# @wisemen/opentelemetry — Getting Started

OpenTelemetry integration for NestJS providing distributed tracing, metrics, structured logging, and exception capture.

## When to Use

- Adding distributed tracing to a NestJS backend
- Decorating service methods with automatic span creation
- Capturing and reporting exceptions to your observability platform
- Sending structured logs via OTLP

**Use instead:** Direct `@opentelemetry/sdk-node` when you need full control over SDK configuration.

## Import

```ts
import {
  configureOpentelemetryTracing, configureOpentelemetryMetrics,
  Trace, captureException, getOtelTracer,
  registerInstrumentation, OpenTelemetryLogger,
} from '@wisemen/opentelemetry'
```

## Quick Start

### 1. Initialize tracing at bootstrap

```ts
// main.ts
import { configureOpentelemetryTracing, registerInstrumentation } from '@wisemen/opentelemetry'

registerInstrumentation()

configureOpentelemetryTracing({
  serviceName: 'my-api',
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  env: process.env.NODE_ENV,
})

// Then bootstrap NestJS app...
```

### 2. Add @Trace() to service methods

```ts
import { Injectable } from '@nestjs/common'
import { Trace } from '@wisemen/opentelemetry'

@Injectable()
export class OrderService {
  @Trace()
  async processOrder(orderId: string): Promise<void> {
    // Automatically creates a span named after this method
  }
}
```

### 3. Capture exceptions

```ts
import { captureException } from '@wisemen/opentelemetry'

try {
  await riskyOperation()
} catch (error) {
  captureException(error, 'Failed to process payment')
  throw error
}
```

### 4. Structured logging (optional)

```ts
import { OpenTelemetryLogger } from '@wisemen/opentelemetry'

const logger = new OpenTelemetryLogger({
  serviceName: 'my-api',
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
})

logger.info({
  context: 'OrderService',
  body: { orderId: '123', status: 'completed' },
})
```

## Source Files

For full API details, read the source files.

- Tracing setup: `lib/tracing.ts`
- Metrics setup: `lib/metrics.ts`
- @Trace() decorator: `lib/trace.decorator.ts`
- Exception capture: `lib/exception.ts`
- Logger: `lib/logging.ts`
- Tracer accessor: `lib/get-otel-tracer.ts`
- Instrumentation: `lib/register-instrumentation.ts`
- Context carrier: `lib/context.ts`
