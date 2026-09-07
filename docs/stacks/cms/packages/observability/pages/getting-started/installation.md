---
title: Installation
---

# Installation

`@wisemen/payload-core-observability` provides two complementary signals:

- **Evlog events** for request and job-level operational records.
- **OpenTelemetry traces** for timing and relationships across HTTP, PostgreSQL, and oRPC work.

The package has a single public entry point:

```ts
import {
  initializeLogging,
  initializeOpenTelemetry,
  withJobLogging,
} from '@wisemen/payload-core-observability'
```

## Install

Add the package and the peer packages used by your application:

```bash
pnpm add @wisemen/payload-core-observability evlog @orpc/server @orpc/otel
```

`payload`, `@orpc/server`, and `@orpc/otel` are peers. Keep them aligned with
the versions already used by the CMS application.

## Initialize logging in every runtime

Call `initializeLogging()` once, as early as possible, in each independent
runtime. For example, a web server and a Payload worker should each initialize
their own logger with a meaningful service name.

```ts
import { initializeLogging } from '@wisemen/payload-core-observability'

initializeLogging({
  environment: process.env.NODE_ENV,
  service: 'cms-worker',
  sampling: {
    rates: {
      info: 1,
    },
  },
})
```

The worker example samples ordinary successful job events at 1%. Failures are
always retained, and slow events are retained by the tail-sampling rule.

## Node runtime requirement

The root package exports the OpenTelemetry Node SDK as well as logging helpers.
Use it from Node server code only. Do not import it from a Next.js Edge route,
Edge middleware, or another Edge-runtime module: the tracing SDK uses Node APIs.

For Next.js, keep the initialization in a Node-only instrumentation module:

```ts
// instrumentation.node.ts
import {
  initializeLogging,
  initializeOpenTelemetry,
} from '@wisemen/payload-core-observability'

export async function register(): Promise<void> {
  initializeLogging({
    environment: process.env.NODE_ENV,
    service: 'cms',
  })
  initializeOpenTelemetry({
    environment: process.env.NODE_ENV,
    serviceName: 'cms',
  })
}
```

An instrumentation entrypoint can dynamically import this Node module only
when `process.env.NEXT_RUNTIME === 'nodejs'`.

Next: [configure logging and sampling](/cms/packages/observability/pages/logging).
