---
title: Logging and sampling
---

# Logging and sampling

`initializeLogging()` configures Evlog once for the current runtime. It sets a
service/environment identity, redacts common credentials, and applies a useful
default sampling policy.

```ts
initializeLogging({
  environment: 'production',
  service: 'cms-api',
})
```

## Default policy

| Event | Default behavior |
| --- | --- |
| `debug` | Dropped (`0%`) |
| `info` | Head-sampled at `10%` |
| `warn` | Head-sampled at `50%` |
| `error` | Retained (`100%`) |
| Slow event | Retained when duration is at least 3 seconds |
| Event with status `400` | Retained |

The duration and status rules are **tail sampling**: Evlog decides after the
event completes, so a slow successful request or job is retained even if its
initial `info` sample would otherwise be dropped.

## Override a service policy

Pass `sampling` to override rates or replace the default `keep` rules.
`rates` is merged with the defaults. Providing `keep` replaces both default
tail rules, so include every rule the service needs.

```ts
initializeLogging({
  service: 'cms-worker',
  slowRequest: {
    durationMs: 5000,
  },
  sampling: {
    rates: {
      info: 1,
    },
  },
})
```

```ts
initializeLogging({
  service: 'cms-api',
  sampling: {
    keep: [
      { duration: 1000 },
      { status: 400 },
      { status: 429 },
    ],
  },
})
```

Use the same `slowRequest.durationMs` across comparable runtimes when you want
their slow-event views to be comparable.

## Hourly S3 audit archive

Create an S3 audit drain and pass it to `initializeLogging()`. It uses Evlog's
audit filter, so it receives only events emitted through Evlog's audit helpers;
normal application logs continue to go to stdout.

```ts
import {
  createS3AuditDrain,
  initializeLogging,
} from '@wisemen/payload-core-observability'

const auditDrain = createS3AuditDrain({
  bucket: process.env.AUDIT_S3_BUCKET!,
  endpoint: process.env.AUDIT_S3_ENDPOINT,
  environment: process.env.NODE_ENV ?? 'development',
  podName: process.env.HOSTNAME,
  service: 'cms',
})

initializeLogging({
  auditDrain,
  service: 'cms',
})

process.once('SIGTERM', () => void auditDrain.flush())
process.once('SIGINT', () => void auditDrain.flush())
```

The drain uploads compressed NDJSON about once per hour for each pod at
`audit/<environment>/<date>-<hour>-<pod>-<batch>.ndjson.gz`. Every
object gets a unique key, so replicas never coordinate through a shared file.
It retries uploads five times. The `maxBatchSize` safety ceiling defaults to
100,000 events; reaching it creates an extra object instead of dropping audits.

## Payload admin audit

Add the Payload audit plugin to record CMS/API operations in the S3 audit
archive. It covers collection creates, updates, deletes, and reads; global
updates and reads; and collection-auth logins/logouts. Unauthenticated HTTP
requests are recorded with `actor: { type: 'api', id: 'anonymous' }`; local
API calls from workers, seeders, and hooks are excluded by default. Events do
not include document values or diffs.

```ts
import { payloadAdminAudit } from '@wisemen/payload-core-observability'

export default buildConfig({
  plugins: [
    payloadAdminAudit(),
  ],
})
```

## Redaction and bounded values

Evlog applies the package's redaction configuration to nested fields matching:

- `authorization`
- `password`
- `secret`
- `token`, `accessToken`, and `refreshToken`
- `apiKey` and `api_key`

Use `limitLoggingValue()` before attaching arbitrary request or job input. It
does not redact values; it bounds them to avoid unusually large events:

- Strings: 2,000 characters
- Arrays: 50 items
- Object keys: 50 keys
- Nested depth: 6 levels

This means custom sensitive fields should be added to Evlog's redaction policy
in the application if they do not match one of the default paths.
