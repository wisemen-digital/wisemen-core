---
"@wisemen/opentelemetry": minor
"@wisemen/nestjs-nats": minor
"@wisemen/pgboss-nestjs-job": minor
---

Emit `exception.message` instead of `exceptions.message`, and route every span exception through `captureException`

`captureException` was migrated to the OpenTelemetry semantic-convention names in an earlier release, but three
other call sites had each hand-rolled the same logic and kept the old plural `exceptions.message`:

| file | package |
|---|---|
| `lib/trace.decorator.ts` | `@wisemen/opentelemetry` |
| `lib/message-handler/nats-message-handler.ts` | `@wisemen/nestjs-nats` |
| `lib/worker/pgboss-worker.thread.ts` | `@wisemen/pgboss-nestjs-job` |

So a single application emitted **both** conventions depending on which code path threw — `exception.message`
from `captureException`, `exceptions.message` from the `@Trace` decorator, a NATS handler or a pg-boss job.

All three now delegate to `captureException`, which removes 36 lines of duplicated logic and makes the attribute
names consistent. Each of the three sites already runs inside an active-span context — `startActiveSpan` in the
decorator, `context.with(trace.setSpan(…))` in the other two — so `captureException` resolves the correct span
and no span-passing variant is needed.

Two incidental fixes fall out of this:

- **`nestjs-nats` never set `exception.type` at all.** It now does, using the error's constructor name — so NATS
  exceptions become identifiable rather than untyped.
- **Non-`Error` throws are now recorded.** All three sites were guarded by `if (e instanceof Error)`, so throwing
  a string or a plain object produced a span with no exception attributes. `captureException` handles those via
  its `object_error` / `unknown_error` branches.

`capture-exception.ts` also now imports `getOtelTracer` from `./get-otel-tracer.js` rather than the `./index.js`
barrel, which removes an import cycle that adding the decorator's import would otherwise have deepened.

Nothing in consumer code has to change — this is a drop-in bump.

Released as `minor` rather than `major` deliberately: there is no API change and no consumer code to migrate, and
a major bump on `nestjs-nats` / `pgboss-nestjs-job` would discourage exactly the adoption this fix needs. The
only observable change is the attribute name.

⚠️ `bumpy status` shows the `minor` on `@wisemen/opentelemetry` (0.3.1 → 0.4.0) pulling dependency-only minor
bumps into `nestjs-domain-events`, `nestjs-http-exception-filter`, `nestjs-swagger`, `nestjs-typesense`,
`pgboss-nestjs-job` and `nestjs-tests`, because they peer-depend via `workspace:^` and npm treats `^` on a 0.x
version as minor-breaking. A `patch` (0.3.2) would stay inside `^0.3.1` and avoid the fan-out entirely — but it
would understate a change that alters emitted telemetry, so the wider release is the honest option. Bumpy's own
suggestion, using `>=0.x` for pre-1.0 peer deps, is the real fix and belongs in its own PR.

`exceptions.captured` in `@wisemen/vue-core-telemetry` is intentionally left alone — it is a custom marker on a
**log record** rather than a span attribute, it has no counterpart in the API packages, and `exception.captured`
would put a non-standard attribute inside the reserved `exception.*` namespace.
