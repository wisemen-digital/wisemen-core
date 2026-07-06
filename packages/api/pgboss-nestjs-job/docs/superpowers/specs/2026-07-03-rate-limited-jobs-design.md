# Rate-limited jobs for `@wisemen/pgboss-nestjs-job`

**Date:** 2026-07-03
**Status:** Implemented (revised)
**Package:** `packages/api/pgboss-nestjs-job`

> **Revision (post-implementation):** the original design put a `@RateLimited(key, config)`
> decorator on the **job class** and had `PgbossRateLimitRegistry` discover it by
> scanning DI providers. That is unsound: the decorated job classes are **not**
> DI providers (only their `@PgBossJobHandler` handlers are), so the registry
> found nothing and the whole feature was inert. The mechanism was pivoted to:
> **(a)** the rate-limit key is a job **option** — `super(data, { rateLimited: key })` —
> serialized to the pg-boss group id and carried on the fetched job (`job.groupId`);
> **(b)** the strategy/config is declared **centrally** on the worker module
> (`PgBossWorkerModule.forRoot({ rateLimits })`), which is where the fetch-gate
> needs the full key set at startup anyway. This removes provider scanning and the
> `className → key` map entirely. Sections below are updated to the implemented
> design; the group-gated-fetch enforcement (§3) is unchanged.

> **Revision 2 — execution accounting moved to the transport layer.** The first
> cut counted usage in the worker thread: consume one token when a job *succeeded*,
> and report header/failure state only when a handler *threw* `RateLimitError`.
> That is a loose proxy for real API usage (a job that retries makes 2 calls but
> consumed 1; a job whose request was sent then failed consumed 0) and header mode
> learned limits one request too late (only off thrown errors). Accounting now
> happens **per HTTP request**, via `@wisemen/node-fetch` interceptors registered
> with `useRateLimiting(client, limiter)`. The worker thread publishes the current
> job's key into an `AsyncLocalStorage` (`rateLimitStorage`) around handler
> execution; the interceptors read it (`currentRateLimitKey()`) and call the limiter
> **hooks** `onRequest` (static: consume per attempt), `onResponse` (headers: record
> reported state on every response; failure: block + throw `RateLimitError` on 429),
> and `onError` (failure: block on transport error). The thread no longer does any
> accounting; `consume`/`report` were replaced by the hooks. The **fetch-gate (§3)
> and the store/strategies are unchanged.** Trade-off: accounting only applies to
> calls routed through an instrumented client (documented footgun). This is the
> "auto HTTP feedback" option noted as future work in §11, now the default.

## 1. Problem

Some jobs call external APIs that are rate limited. Today those jobs just run,
hit the limit, **fail, and requeue** (the Trixxa pattern) — burning retries,
producing noise, and never actually respecting the limit. We want a **default,
reusable** way to make a job queue respect an external rate limit, that:

- works when we **scale to multiple worker instances** (state must be shared,
  not per-process),
- does **not** stall unrelated jobs that happen to share a queue,
- handles three levels of knowledge about the limit:
  1. **Header mode** — the API tells us (`X-RateLimit-Remaining` / `Retry-After`),
  2. **Static mode** — we know a configured budget (e.g. 100/min), nothing in the response,
  3. **Learn-nothing mode** — we know nothing; we only find out by getting a `429`.

## 2. Goals / non-goals

**Goals**
- A job declares "I'm governed by rate limit X" with a single job option
  (`{ rateLimited: X }`); the limit's strategy/budget is declared once, centrally,
  on the worker.
- Rate-limit state is shared across workers via Postgres (no new infra).
- When a limit is exhausted, the governed jobs **wait in `created` state** — they
  are not pulled into `active`, not failed, and don't consume a retry.
- Other (non-governed, or differently-governed) jobs on the **same queue keep flowing**.
- All three signal modes are supported behind one interface.

**Non-goals**
- Guaranteeing zero overshoot on the very first poll after exhaustion (bounded,
  self-correcting overshoot is acceptable — see §8).
- A generic HTTP client/interceptor that auto-reports limits (a possible future
  enhancement, §11 — v1 reports feedback explicitly).
- Changing how non-rate-limited jobs behave (fully backward compatible).

## 3. Chosen approach — group-gated fetch ("B")

We enforce the limit at the **fetch** boundary using pg-boss **groups**.

- Each governed job is tagged at enqueue with `group: { id: <limitKey> }`.
- Before each poll, the worker asks the limiter *which keys are exhausted right
  now* and passes them to pg-boss `fetch` as `ignoreGroups`. pg-boss's fetch SQL
  excludes those jobs (`... AND (group_id IS NULL OR group_id <> ALL($ignoreGroups))`),
  so they **stay in `created`** — never pulled, no churn — while other groups on
  the same queue continue to drain.

This is the "bouncer-per-job" idea done at the right layer: a per-**group** gate
inside the fetch query rather than a whole-queue on/off switch.

### Why not "A" (queue-per-limit + whole-queue bouncer)

A is simpler (reuses the existing bouncer verbatim, zero framework changes) but
forces **one dedicated queue per rate-limited API**. Real jobs don't partition
that way: e.g. `GenerateInvoicePdfJob` is `@PgBossJob(QueueName.SYSTEM)` — it
shares `SYSTEM` with many job types, dispatched by `className`. Under A we'd have
to split every rate-limited job into its own queue; under B it stays on `SYSTEM`
and just carries a group tag. A remains viable as a pure-userland fallback, but B
is the general default. The **RateLimiter core and the execution-side reporting
are identical either way**, so that work is not wasted if a team chooses A.

## 4. Architecture

The rate-limit **key** rides with the job (a job option → pg-boss group id); the
**config** for each key is declared centrally on the worker. The key is read/used
at **three** points:

```
   worker rateLimits: { stripe: <strategy/config> }   ← central config (startup)
   job option:        { rateLimited: 'stripe' }        ← per-job opt-in
                     │
   ┌─────────────────┼──────────────────────────┐
   │ (enqueue)       │ (fetch-gate)              │ (execution)
   ▼                 ▼                           ▼
serializeJob     PgbossRateLimiter           worker thread
 reads job     → worker asks limiter:      →  reads job.groupId, then
 option →         "which keys blocked?"        after the API call:
 group id         → fetch({ ignoreGroups })    consume (static) /
                                               report(headers|429)
```

- **Opt-in** — `super(data, { rateLimited: key })` on the job. No decorator, no
  reflection; `serializeJob` copies the option to the group id.
- **`PgbossRateLimitRegistry`** — constructed from the central `RateLimitConfigMap`
  (via `PgbossRateLimitModule.forRoot(limits)`), it holds `key → { config, strategy }`.
  No provider scanning; no `className` map. Available at startup, which is exactly
  what the fetch-gate needs.
- **`PgbossRateLimiter`** — shared, Postgres-backed service keyed by limit key.
  Delegates to one of three **strategies**. Two responsibilities:
  - **read (fetch-gate):** `blockedKeys() → string[]`
  - **write (execution):** `consume(key)` and/or `report(key, signal)`, where the
    key comes from `job.groupId` on the fetched job.
- **Persistence:** the `pgboss.rate_limit` table (via the same `EntityManager` the
  scheduler injects), one row per key, updated atomically; schema ensured on worker init.

## 5. Opt-in (job option) + central config

Opt a job in with the `rateLimited` option; declare the strategy centrally:

```ts
// per-job opt-in — just the key
@PgBossJob(QueueName.SYSTEM)
export class ChargeCardJob extends BaseJob<…> {
  constructor (…) { super(data, { rateLimited: 'stripe' }) }
}

// central config on the worker (one entry per API)
PgBossWorkerModule.forRoot({
  queues: [...],
  rateLimits: {
    stripe: { source: 'static', limit: 100, windowSeconds: 60 },  // static
    cuopt:  { source: 'headers' },                                 // header-driven
    flaky:  { source: 'failure', backoffSeconds: 30 },            // learn-nothing
  },
})
```

The key is the single source of truth: `serializeJob` reads it from the job (no
reflection), it is stored as the group id, and the worker resolves the strategy
from the central `rateLimits` map. Multiple job classes (and multiple queues) may
share a key; they then share one limiter/bucket. The config belongs to the API,
so it lives once in `rateLimits` rather than repeated on each job — which also
avoids the "two classes, same key, different config, second silently ignored"
hazard the per-class decorator had.

## 6. The three strategies + reset semantics

Only static mode maintains a true "requests remaining" counter. Header mode
mirrors the API's numbers; learn-nothing tracks only a cooldown.

| Mode | Counter? | State (per key) | `isBlocked` | Reset |
|---|---|---|---|---|
| **Static** (`perMinute`/`perSecond`) | ✅ owned | `tokens`, `window_start` | `tokens <= 0` | time-window refill (fixed window or token-bucket) |
| **Header** (`source: 'headers'`) | ⚠️ mirror | `remaining`, `reset_at` | `remaining <= 0 && now < reset_at` | at `reset_at` (API-provided) |
| **Learn-nothing** (`onFailure: 'backoff'`) | ❌ none | `blocked_until` | `now < blocked_until` | backoff expiry |

A **strategy** is a pure predicate over the stored row (the fetch-gate read);
the **limiter** owns the writes (`consume`/`report`), keyed by the limit key:

```ts
interface RateLimitStrategy {
  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean   // fetch-gate (read)
}

class PgbossRateLimiter {
  blockedKeys (): Promise<string[]>                         // fetch-gate over all keys
  consume (key: string): Promise<void>                     // static: decrement on call
  report  (key: string, signal: RateLimitSignal): Promise<void> // header/failure: feedback
}
```

`RateLimitSignal` carries what execution observed: HTTP status, `Retry-After`,
`X-RateLimit-*` headers (or a normalized `{ remaining, resetAt }` / `{ throttled: true }`).

## 7. Enforcement flow / framework touchpoints

All edits live in the library. Files and the change each needs:

1. **`lib/jobs/base-job.ts`** — the options type gains `rateLimited?: string`
   (`BaseJobOptions`). **`lib/scheduler/pgboss-scheduler.ts`** (`serializeJob`) reads
   it via `resolveGroupId(job)` (`job.options?.rateLimited`, no reflection) and sets
   `groupId` on **`lib/jobs/serialized-job.ts`**. pg-boss's bulk `insert` recordset
   expects a flattened `"groupId"` (verified in pg-boss `plans.js`).

2. **`lib/worker/pgboss-worker.ts`** (`fetchJobs`) — before building the fetch
   promise, `ignoreGroups = await rateLimiter.blockedKeys()` and pass
   `this.client.fetch(queueName, { batchSize, ignoreGroups })`. **No `PgBossClient`
   change** — `FetchOptions` already accepts `ignoreGroups`. Existing `canProceed()`
   still runs first and composes (whole-queue park vs per-group park). The worker
   consults the limiter directly — `PgbossBouncer` is **not** extended, so existing
   bouncers are untouched and no bouncer is required for rate limiting.

3. **`lib/worker/pgboss-worker.thread.ts`** (`run`) — after the handler completes,
   `if (job.groupId != null) rateLimiter.consume(job.groupId)`; on a thrown
   `RateLimitError`, `rateLimiter.report(job.groupId, error.signal)`. The key comes
   straight off the fetched job (`Job.groupId`), so **no `className → key` lookup**.
   Count at **execution**, not fetch, so a job that errored before the API call
   doesn't burn quota.

4. **`lib/worker/pgboss-worker.module.ts` / `.module-options.ts`** — add a
   `rateLimits?: RateLimitConfigMap` option; `forRoot`/`forRootAsync` import
   `PgbossRateLimitModule.forRoot(rateLimits)`. `PgBossSchedulerModule` does **not**
   import it — producers only tag the group at enqueue, no limiter needed.

5. **New:** `lib/rate-limit/` — `PgbossRateLimitModule.forRoot(limits)`,
   `PgbossRateLimitRegistry` (config-map driven), `PgbossRateLimiter` + 3 strategies,
   `PostgresRateLimitStore` (ensures schema on init), `RateLimitError`,
   `parseRateLimitHeaders`. Exported from `lib/index.ts`. (No decorator.)

### Multi-worker atomicity

Static consume is a single atomic statement so N workers never over-spend:

```sql
UPDATE pgboss_rate_limit
SET tokens = tokens - 1
WHERE key = $1 AND tokens > 0
RETURNING tokens;      -- no row / tokens null → blocked
```

Refill is computed lazily from `window_start`/elapsed on read (no cron needed).

## 8. Edge cases & decisions

- **Overshoot:** the fetch-gate is binary per poll, and pg-boss `fetch` can't cap
  *count per group* in one call. So a worker may pull up to `batchSize` of an
  allowed group whose remaining budget was smaller → overshoot bounded by
  `batchSize × workers` per poll. **Decision:** accept it for v1; header mode
  self-corrects on the next `report`; static mode can optionally lower `batchSize`
  for hot queues or reserve-at-fetch later.
- **Group present but no limiter registered:** treated as not blocked (fail-open,
  mirroring `AllowBouncer`) — a misconfiguration never wedges the queue.
- **Backward compatibility:** groups and `@RateLimited` are opt-in; untagged jobs
  and existing bouncers behave exactly as today.
- **Shared budget across job types/queues:** the bucket is keyed by the limit key,
  not the queue — two job classes hitting the same API share one counter.
- **`report` failure / limiter DB error:** log + fail-open on the read path
  (don't block work on limiter infra hiccups); execution write errors are
  swallowed like the existing `fail(...).catch(() => {})`.

## 9. Testing

- **Strategy unit tests:** each of the three — token depletion + window reset
  (static), header parse + `reset_at` expiry (header), 429 → `blocked_until` +
  backoff expiry (learn-nothing).
- **Atomicity:** concurrent `consume` from parallel connections never drives
  `tokens` below zero (integration test against Postgres).
- **Fetch-gate:** enqueue mixed-group jobs on one queue; exhaust one key; assert
  only that group's jobs stay `created` while others drain.
- **End-to-end:** a governed job that hits a stubbed 429 gets deferred (stays
  queued, no retry burned) and drains once the cooldown passes.
- **Backward compat:** existing bouncer + untagged jobs unchanged.

## 10. Rollout

1. Land `lib/rate-limit/` + `serialized-job`/`serializeJob` group support (inert
   until a job is decorated).
2. Extend bouncer interface + worker fetch (`blockedGroups`/`ignoreGroups`).
3. Ship migration for `pgboss_rate_limit`.
4. Adopt in one real consumer (a Trixxa rate-limited job) as the reference.

## 11. Future (out of scope for v1)

- A shared HTTP interceptor that auto-calls `report()` from responses (removes the
  explicit report call in handlers).
- Reserve-at-fetch to eliminate overshoot entirely.
- Per-tenant keys (`group = 'stripe:tenant42'`) — already supported by the keying
  model, just needs a documented pattern.

## 12. Alternatives considered

- **Per-job defer** (pull job → try token → reschedule via `startAfter`): precise
  but pulls every job into `active` just to defer it — churn under backlog, and
  either burns a retry or loses job identity. Rejected in favour of gating at fetch.
- **Refuse at enqueue** (producer checks limiter before `send`): matches "don't
  schedule it" literally but throws away the durable-queue safety net. Rejected.
- **Approach A** (queue-per-limit): documented in §3; viable userland fallback,
  not the default.
