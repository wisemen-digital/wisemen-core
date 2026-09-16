---
"@wisemen/opentelemetry": minor
---

Trace the NestJS layers between the HTTP span and the database

Our APIs run on `FastifyAdapter`, so the Express instrumentation this package
registered never patched anything: Express is never loaded, its module hook never
fires, and `ignoreLayersType` was a no-op. Traces went from the HTTP server span
straight to the NestJS controller span.

`@fastify/otel` replaces it — the instrumentation maintained by the Fastify
authors, which `@opentelemetry/instrumentation-fastify` is deprecated in favour
of. It self-registers through `registerOnInitialization`, so applications need no
wiring, but **`registerInstrumentation()` must run before `fastify` is imported**.
Only the hooks that carry application logic are instrumented, and anonymous hook
handlers are named after their route rather than the plugin chain.

Middleware, guards, interceptors, exception filters, use cases and repositories
are now traced too. This is automatic: `NestFactory` is patched, so no
application changes are needed, and if wrapping fails the span is lost but the
application is not.
