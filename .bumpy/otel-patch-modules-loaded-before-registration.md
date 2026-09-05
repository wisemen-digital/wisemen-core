---
"@wisemen/opentelemetry": patch
---

Instrument `http` even when it was loaded before `registerInstrumentation` ran

Services on 0.3.0 or later emit **no incoming HTTP server spans at all** — no route, method, status code, URL
or `Origin` on anything, and no parent span for the rest of the request to attach to.

`require-in-the-middle`, which `@opentelemetry/instrumentation` uses to patch CommonJS modules, only intercepts
a `require()` made *after* an instrumentation is registered. 0.3.0 moved `registerInstrumentation()` inside
`startOpentelemetryTracing()`, which entrypoints call *below* their imports:

```ts
import { NestFactory } from '@nestjs/core'
import { FastifyContainer } from '@wisemen/app-container/fastify'   // ← loads node:http
import { bootstrapOtelTracing } from '#src/modules/opentelemetry/opentelemetry.config.js'

bootstrapOtelTracing()                                              // ← too late for http
```

By then `http` is already in the module cache and never passes through the hook again, so
`http.Server.prototype.emit` is never wrapped.

Knock-on effect: with no server span there is no active span during a request, so `captureException` takes its
"no active span" branch and emits a bare root span carrying only `exception.*` — an orphan trace with no request
context at all.

`registerInstrumentation()` now re-requires `http` and `https` after registering, which sends them back through
the hook and patches the same module object the application already holds a reference to. Re-requiring an
already-patched module is a no-op, so import order no longer matters and **no consumer code changes** — a
version bump is enough.

Lazily required modules were never affected: `pg` and `redis` are loaded at connection time, after registration,
so they patch fine either way. That is why the regression went unnoticed — checking for `pg.query:*` spans
cannot detect it. The check that does is `kind_string = 'Server'` for the service, in the environment actually
deployed.

`patch` rather than `minor` deliberately: there is no API change, and 0.4.1 stays inside `^0.4.0` so consumers
already on 0.4.x pick it up without the peer-dependency fan-out a minor triggers on a 0.x version. Consumers
pinned to 0.3.x need an explicit bump.
