# Rate-limited jobs Implementation Plan

> **⚠️ Superseded discovery mechanism (read first).** This plan was executed as
> written, but a final whole-branch review found the design's discovery mechanism
> was inert: `@RateLimited` was placed on **job classes**, which are not DI
> providers, so the provider-scanning `PgbossRateLimitRegistry` never found them
> and rate limiting never engaged. The implementation was pivoted (approach "D"):
> the key is now a **job option** (`super(data, { rateLimited: key })`) carried as
> the pg-boss group id and read off `job.groupId` at execution; the config is
> declared **centrally** on the worker (`PgBossWorkerModule.forRoot({ rateLimits })`).
> The `@RateLimited` decorator and provider scanning were removed. See the design
> spec's **Revision** note for the final design. The enforcement layer (group-gated
> fetch, atomic token bucket, three strategies) below is unchanged and still valid;
> the decorator/registry-discovery tasks (1, 5) reflect the superseded mechanism.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `@wisemen/pgboss-nestjs-job` a reusable way to make jobs respect an external API's rate limit by gating pg-boss `fetch` per group, so exhausted jobs wait in `created` state instead of failing and requeuing.

**Architecture (as implemented):** A job opts into a limit with the `rateLimited` job option, read at three points — enqueue (tag the job's pg-boss `group`), fetch (exclude exhausted groups via `ignoreGroups`), and execution (count/report usage, keyed off `job.groupId`). Limit strategy/config is declared centrally via `PgBossWorkerModule.forRoot({ rateLimits })`. A shared, Postgres-backed `PgbossRateLimiter` with three pluggable strategies (static / headers / failure-backoff) owns the state. Strategies are pure functions over a `RateLimitStore` seam so logic is unit-testable without a database.

**Tech Stack:** TypeScript (ESM, NodeNext), NestJS, pg-boss 12.15.0, TypeORM (via `@wisemen/nestjs-typeorm`), `node:test` + `node:assert` test runner.

## Global Constraints

- **Package:** all edits are inside `packages/api/pgboss-nestjs-job/`. Run commands from that directory.
- **ESM imports:** every relative import MUST end in `.js` (NodeNext), even from `.ts` files. Match the existing style.
- **Tests:** written as `lib/**/*.test.ts`, run via `pnpm test` (which builds first, then `node --test ./dist/**/*.test.js`). Use `node:test` (`describe`/`it`) + `node:assert/strict`. No third-party test libs.
- **Decorator metadata:** use `Reflect.defineMetadata` / `Reflect.getMetadata` with a module-private `Symbol` token, mirroring `lib/worker/pgboss-bouncer.decorator.ts`.
- **Provider scanning:** reuse the existing `ProvidersExplorer` (`lib/providers/providers-explorer.ts`), exactly as `PgbossBouncerRegistry` does.
- **Naming:** exported public symbols are prefixed `Pgboss`. The decorator is `RateLimited` (matches the bare `Bouncer` export style).
- **Backward compatibility:** untagged jobs and existing bouncers behave exactly as today. The rate-limit gate is a separate mechanism; **the `PgbossBouncer` interface is NOT changed** (resolves the spec §7.2 open question — the worker consults the limiter directly for `ignoreGroups`, the bouncer stays boolean).
- **Rate-limit table:** created idempotently at runtime via `CREATE TABLE IF NOT EXISTS pgboss.rate_limit (...)` on module init (same self-managing-schema pattern pg-boss uses), so consumers need no migration.
- **Insert path detail:** pg-boss `manager.insert` JSON-stringifies job objects straight into `json_to_recordset`, whose column is `"groupId"` — so serialized jobs need a **top-level `groupId`** string, not a nested `group`.

---

## Phase 1 — Static-rate mode (shippable MVP)

Delivers a complete, working rate limiter for the "we know N per window" case: gate at fetch, atomic token bucket in Postgres, auto-consume one token per successful job. Header/failure modes come in Phase 2.

### Task 1: `@RateLimited` decorator + metadata + first test scaffold

**Files:**
- Create: `lib/rate-limit/rate-limit-config.ts`
- Create: `lib/rate-limit/rate-limit.decorator.ts`
- Test: `lib/rate-limit/rate-limit.decorator.test.ts`

**Interfaces:**
- Produces:
  - `type RateLimitConfig = StaticRateLimitConfig | HeaderRateLimitConfig | FailureBackoffConfig`
  - `interface StaticRateLimitConfig { source: 'static', limit: number, windowSeconds: number }`
  - `interface HeaderRateLimitConfig { source: 'headers', remainingHeader?: string, resetHeader?: string, retryAfterHeader?: string }`
  - `interface FailureBackoffConfig { source: 'failure', backoffSeconds: number, maxBackoffSeconds?: number }`
  - `interface RateLimitSignal { status?: number, retryAfterSeconds?: number, remaining?: number, resetAt?: Date, throttled?: boolean }`
  - `function RateLimited(key: string, config: RateLimitConfig): ClassDecorator`
  - `interface RateLimitMetadata { key: string, config: RateLimitConfig }`
  - `function getRateLimitMetadata(target: object): RateLimitMetadata | undefined`

- [ ] **Step 1: Write the config types**

Create `lib/rate-limit/rate-limit-config.ts`:

```ts
export interface StaticRateLimitConfig {
  source: 'static'
  /** Maximum number of requests allowed per window. */
  limit: number
  /** Length of the window in seconds. */
  windowSeconds: number
}

export interface HeaderRateLimitConfig {
  source: 'headers'
  remainingHeader?: string
  resetHeader?: string
  retryAfterHeader?: string
}

export interface FailureBackoffConfig {
  source: 'failure'
  backoffSeconds: number
  maxBackoffSeconds?: number
}

export type RateLimitConfig =
  | StaticRateLimitConfig
  | HeaderRateLimitConfig
  | FailureBackoffConfig

/** What execution observed after calling the API. */
export interface RateLimitSignal {
  status?: number
  retryAfterSeconds?: number
  remaining?: number
  resetAt?: Date
  throttled?: boolean
}
```

- [ ] **Step 2: Write the failing test**

Create `lib/rate-limit/rate-limit.decorator.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { RateLimited, getRateLimitMetadata } from './rate-limit.decorator.js'

describe('RateLimited decorator', () => {
  it('attaches key and config metadata to the class', () => {
    @RateLimited('stripe', { source: 'static', limit: 100, windowSeconds: 60 })
    class ChargeJob {}

    const meta = getRateLimitMetadata(ChargeJob)
    assert.equal(meta?.key, 'stripe')
    assert.deepEqual(meta?.config, { source: 'static', limit: 100, windowSeconds: 60 })
  })

  it('returns undefined for undecorated classes', () => {
    class Plain {}
    assert.equal(getRateLimitMetadata(Plain), undefined)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: build fails / test FAILs — `rate-limit.decorator.js` has no `RateLimited` export.

- [ ] **Step 4: Implement the decorator**

Create `lib/rate-limit/rate-limit.decorator.ts`:

```ts
import type { ClassConstructor } from 'class-transformer'
import { RateLimitConfig } from './rate-limit-config.js'

const PGBOSS_RATE_LIMIT_TOKEN = Symbol('wisemen.pgboss-rate-limit')

export interface RateLimitMetadata {
  key: string
  config: RateLimitConfig
}

/**
 * Declares that jobs of this class are governed by the rate limit `key`.
 * Read at three points: enqueue (group tag), fetch (ignoreGroups), execution (usage).
 * Place on the job class, next to `@PgBossJob`.
 */
export function RateLimited (key: string, config: RateLimitConfig): ClassDecorator {
  return (target: object): void => {
    const metadata: RateLimitMetadata = { key, config }
    Reflect.defineMetadata(PGBOSS_RATE_LIMIT_TOKEN, metadata, target)
  }
}

export function getRateLimitMetadata (target: object): RateLimitMetadata | undefined {
  return Reflect.getMetadata(PGBOSS_RATE_LIMIT_TOKEN, target) as RateLimitMetadata | undefined
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add lib/rate-limit/rate-limit-config.ts lib/rate-limit/rate-limit.decorator.ts lib/rate-limit/rate-limit.decorator.test.ts
git commit -m "feat(rate-limit): @RateLimited decorator and config types"
```

---

### Task 2: Token-bucket refill math (pure)

**Files:**
- Create: `lib/rate-limit/refill.ts`
- Test: `lib/rate-limit/refill.test.ts`

**Interfaces:**
- Produces:
  - `interface Bucket { tokens: number, windowStartAt: Date }`
  - `function refill(bucket: Bucket | null, config: StaticRateLimitConfig, now: Date): Bucket` — returns a full bucket at a fresh window boundary when `bucket` is null or its window has elapsed; otherwise returns it unchanged.

- [ ] **Step 1: Write the failing test**

Create `lib/rate-limit/refill.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { refill } from './refill.js'

const config = { source: 'static' as const, limit: 3, windowSeconds: 60 }

describe('refill', () => {
  it('creates a full bucket when none exists', () => {
    const now = new Date('2026-07-03T10:00:00Z')
    const b = refill(null, config, now)
    assert.equal(b.tokens, 3)
    assert.equal(b.windowStartAt.toISOString(), now.toISOString())
  })

  it('keeps the bucket unchanged inside the window', () => {
    const start = new Date('2026-07-03T10:00:00Z')
    const now = new Date('2026-07-03T10:00:30Z')
    const b = refill({ tokens: 1, windowStartAt: start }, config, now)
    assert.equal(b.tokens, 1)
    assert.equal(b.windowStartAt.toISOString(), start.toISOString())
  })

  it('refills to full at a new window once the window elapsed', () => {
    const start = new Date('2026-07-03T10:00:00Z')
    const now = new Date('2026-07-03T10:01:05Z')
    const b = refill({ tokens: 0, windowStartAt: start }, config, now)
    assert.equal(b.tokens, 3)
    assert.equal(b.windowStartAt.toISOString(), now.toISOString())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no `refill` export.

- [ ] **Step 3: Implement**

Create `lib/rate-limit/refill.ts`:

```ts
import { StaticRateLimitConfig } from './rate-limit-config.js'

export interface Bucket {
  tokens: number
  windowStartAt: Date
}

export function refill (
  bucket: Bucket | null,
  config: StaticRateLimitConfig,
  now: Date
): Bucket {
  if (bucket === null) {
    return { tokens: config.limit, windowStartAt: now }
  }

  const elapsedMs = now.getTime() - bucket.windowStartAt.getTime()

  if (elapsedMs >= config.windowSeconds * 1000) {
    return { tokens: config.limit, windowStartAt: now }
  }

  return bucket
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit/refill.ts lib/rate-limit/refill.test.ts
git commit -m "feat(rate-limit): token-bucket refill math"
```

---

### Task 3: Strategy interface + static strategy `isBlocked` (pure)

**Files:**
- Create: `lib/rate-limit/rate-limit.strategy.ts`
- Create: `lib/rate-limit/strategies/static-rate.strategy.ts`
- Test: `lib/rate-limit/strategies/static-rate.strategy.test.ts`

**Interfaces:**
- Consumes: `refill`, `Bucket` (Task 2); config types (Task 1).
- Produces:
  - `interface RateLimitBucketRow { key: string, tokens: number | null, windowStartAt: Date | null, resetAt: Date | null, blockedUntil: Date | null }`
  - `interface RateLimitStrategy { isBlocked(row: RateLimitBucketRow | null, now: Date): boolean }`
  - `class StaticRateStrategy implements RateLimitStrategy { constructor(config: StaticRateLimitConfig); isBlocked(...): boolean }`

- [ ] **Step 1: Write the strategy interface**

Create `lib/rate-limit/rate-limit.strategy.ts`:

```ts
export interface RateLimitBucketRow {
  key: string
  tokens: number | null
  windowStartAt: Date | null
  resetAt: Date | null
  blockedUntil: Date | null
}

export interface RateLimitStrategy {
  /** Fetch-gate read: is this key blocked right now, given its stored row? */
  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean
}
```

- [ ] **Step 2: Write the failing test**

Create `lib/rate-limit/strategies/static-rate.strategy.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { StaticRateStrategy } from './static-rate.strategy.js'

const strategy = new StaticRateStrategy({ source: 'static', limit: 3, windowSeconds: 60 })
const now = new Date('2026-07-03T10:00:30Z')
const start = new Date('2026-07-03T10:00:00Z')

describe('StaticRateStrategy.isBlocked', () => {
  it('is not blocked when no row exists (full budget)', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })

  it('is blocked when tokens are exhausted inside the window', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: start, resetAt: null, blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), true)
  })

  it('is not blocked once the window has elapsed (refills)', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: start, resetAt: null, blockedUntil: null }
    const later = new Date('2026-07-03T10:01:05Z')
    assert.equal(strategy.isBlocked(row, later), false)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no `StaticRateStrategy`.

- [ ] **Step 4: Implement**

Create `lib/rate-limit/strategies/static-rate.strategy.ts`:

```ts
import { StaticRateLimitConfig } from '../rate-limit-config.js'
import { refill } from '../refill.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export class StaticRateStrategy implements RateLimitStrategy {
  constructor (private readonly config: StaticRateLimitConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    const bucket = row?.windowStartAt != null && row.tokens != null
      ? { tokens: row.tokens, windowStartAt: row.windowStartAt }
      : null

    const refilled = refill(bucket, this.config, now)

    return refilled.tokens <= 0
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/rate-limit/rate-limit.strategy.ts lib/rate-limit/strategies/static-rate.strategy.ts lib/rate-limit/strategies/static-rate.strategy.test.ts
git commit -m "feat(rate-limit): strategy interface and static isBlocked"
```

---

### Task 4: `RateLimitStore` interface + Postgres implementation

**Files:**
- Create: `lib/rate-limit/rate-limit.store.ts`
- Create: `lib/rate-limit/postgres-rate-limit.store.ts`
- Test: `lib/rate-limit/postgres-rate-limit.store.test.ts` (integration — flagged)

**Interfaces:**
- Consumes: `RateLimitBucketRow` (Task 3).
- Produces:
  - `abstract class RateLimitStore { ensureSchema(); getMany(keys); tryConsumeToken(key, limit, windowSeconds); setBlockedUntil(key, until); setHeaderState(key, remaining, resetAt) }` with exact signatures below.
  - `class PostgresRateLimitStore extends RateLimitStore` (uses injected TypeORM `EntityManager`).

- [ ] **Step 1: Write the store interface**

Create `lib/rate-limit/rate-limit.store.ts`:

```ts
import { RateLimitBucketRow } from './rate-limit.strategy.js'

export abstract class RateLimitStore {
  abstract ensureSchema (): Promise<void>
  abstract getMany (keys: string[]): Promise<RateLimitBucketRow[]>
  /** Atomically refill+decrement one token. Returns true if a token was granted. */
  abstract tryConsumeToken (key: string, limit: number, windowSeconds: number): Promise<boolean>
  abstract setBlockedUntil (key: string, until: Date): Promise<void>
  abstract setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void>
}
```

- [ ] **Step 2: Implement the Postgres store**

Create `lib/rate-limit/postgres-rate-limit.store.ts`:

```ts
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { RateLimitBucketRow } from './rate-limit.strategy.js'
import { RateLimitStore } from './rate-limit.store.js'

interface RawRow {
  key: string
  tokens: number | null
  window_start_at: Date | null
  reset_at: Date | null
  blocked_until: Date | null
}

@Injectable()
export class PostgresRateLimitStore extends RateLimitStore {
  constructor (
    @InjectEntityManager() private readonly manager: EntityManager
  ) {
    super()
  }

  async ensureSchema (): Promise<void> {
    await this.manager.query(`
      CREATE TABLE IF NOT EXISTS pgboss.rate_limit (
        key text PRIMARY KEY,
        tokens integer,
        window_start_at timestamptz,
        reset_at timestamptz,
        blocked_until timestamptz,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }

  async getMany (keys: string[]): Promise<RateLimitBucketRow[]> {
    if (keys.length === 0) {
      return []
    }

    const rows = await this.manager.query<RawRow[]>(
      `SELECT key, tokens, window_start_at, reset_at, blocked_until
       FROM pgboss.rate_limit WHERE key = ANY($1)`,
      [keys]
    )

    return rows.map(r => ({
      key: r.key,
      tokens: r.tokens,
      windowStartAt: r.window_start_at,
      resetAt: r.reset_at,
      blockedUntil: r.blocked_until
    }))
  }

  async tryConsumeToken (key: string, limit: number, windowSeconds: number): Promise<boolean> {
    // Upsert-then-atomically-decrement in one statement. The window resets to a
    // full budget when window_start_at is null or older than windowSeconds;
    // otherwise the counter is ALWAYS decremented (it may drift negative under
    // contention — that is fine, it self-heals at the next window). The call is
    // granted iff the resulting count is >= 0: the last token lands on exactly 0
    // (granted), an over-budget call lands on -1 (denied). This unambiguous
    // grant test is why we do not clamp at 0.
    const rows = await this.manager.query<Array<{ tokens: number }>>(
      `
      INSERT INTO pgboss.rate_limit (key, tokens, window_start_at, updated_at)
      VALUES ($1, $2 - 1, now(), now())
      ON CONFLICT (key) DO UPDATE SET
        window_start_at = CASE
          WHEN pgboss.rate_limit.window_start_at IS NULL
            OR pgboss.rate_limit.window_start_at < now() - ($3 || ' seconds')::interval
          THEN now() ELSE pgboss.rate_limit.window_start_at END,
        tokens = CASE
          WHEN pgboss.rate_limit.window_start_at IS NULL
            OR pgboss.rate_limit.window_start_at < now() - ($3 || ' seconds')::interval
          THEN $2 - 1
          ELSE pgboss.rate_limit.tokens - 1 END,
        updated_at = now()
      RETURNING tokens
      `,
      [key, limit, String(windowSeconds)]
    )

    return rows.length > 0 && rows[0].tokens >= 0
  }

  async setBlockedUntil (key: string, until: Date): Promise<void> {
    await this.manager.query(
      `INSERT INTO pgboss.rate_limit (key, blocked_until, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET blocked_until = $2, updated_at = now()`,
      [key, until]
    )
  }

  async setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void> {
    await this.manager.query(
      `INSERT INTO pgboss.rate_limit (key, tokens, reset_at, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (key) DO UPDATE SET tokens = $2, reset_at = $3, updated_at = now()`,
      [key, remaining, resetAt]
    )
  }
}
```

- [ ] **Step 3: Write the integration test (flagged — needs Postgres)**

Create `lib/rate-limit/postgres-rate-limit.store.test.ts`. This requires a live Postgres with the `pgboss` schema; it is skipped unless `RATE_LIMIT_TEST_DATABASE_URL` is set.

```ts
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { DataSource } from 'typeorm'
import { PostgresRateLimitStore } from './postgres-rate-limit.store.js'

const url = process.env.RATE_LIMIT_TEST_DATABASE_URL

describe('PostgresRateLimitStore (integration)', { skip: url == null }, () => {
  let ds: DataSource
  let store: PostgresRateLimitStore

  before(async () => {
    ds = new DataSource({ type: 'postgres', url })
    await ds.initialize()
    await ds.query('CREATE SCHEMA IF NOT EXISTS pgboss')
    store = new PostgresRateLimitStore(ds.manager)
    await store.ensureSchema()
    await ds.query(`DELETE FROM pgboss.rate_limit WHERE key = 'itest'`)
  })

  after(async () => {
    await ds?.destroy()
  })

  it('grants exactly `limit` tokens then blocks', async () => {
    const granted: boolean[] = []
    for (let i = 0; i < 4; i++) {
      granted.push(await store.tryConsumeToken('itest', 3, 60))
    }
    assert.deepEqual(granted, [true, true, true, false])
  })
})
```

- [ ] **Step 4: Run tests**

Run: `pnpm test` (integration test SKIPS without the env var — that is expected and fine).
Optional full check: `RATE_LIMIT_TEST_DATABASE_URL=postgres://localhost/postgres pnpm test`.
Expected: build passes, all non-skipped tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit/rate-limit.store.ts lib/rate-limit/postgres-rate-limit.store.ts lib/rate-limit/postgres-rate-limit.store.test.ts
git commit -m "feat(rate-limit): Postgres store with atomic token bucket"
```

---

### Task 5: `PgbossRateLimitRegistry` — scan providers, map keys

**Files:**
- Create: `lib/rate-limit/rate-limit.registry.ts`
- Test: `lib/rate-limit/rate-limit.registry.test.ts`

**Interfaces:**
- Consumes: `getRateLimitMetadata` (Task 1); config types; `RateLimitStrategy`, `StaticRateStrategy`.
- Produces:
  - `class PgbossRateLimitRegistry` with:
    - `onModuleInit(): void`
    - `getKeysForClass(className: string): string | undefined` — the limit key a job class is governed by (by class name), or undefined.
    - `getStrategy(key: string): RateLimitStrategy | undefined`
    - `getConfig(key: string): RateLimitConfig | undefined`
    - `getAllKeys(): string[]`

Note: the registry maps by **class name** because that is what the worker thread has at runtime (`job.data.className`). Queue→keys narrowing is not stored; the worker gates on all keys (small set) — simplest correct choice.

- [ ] **Step 1: Write the failing test**

Create `lib/rate-limit/rate-limit.registry.test.ts`. We drive the registry with a fake `ProvidersExplorer` shape so no Nest container is needed.

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { RateLimited } from './rate-limit.decorator.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'

@RateLimited('stripe', { source: 'static', limit: 100, windowSeconds: 60 })
class ChargeJob {}
class PlainJob {}

function fakeExplorer (classes: Array<new () => unknown>) {
  return { providers: classes.map(c => ({ providerClass: c, instanceWrapper: {} })) } as never
}

describe('PgbossRateLimitRegistry', () => {
  it('maps decorated classes to keys and builds a strategy', () => {
    const registry = new PgbossRateLimitRegistry(fakeExplorer([ChargeJob, PlainJob]))
    registry.onModuleInit()

    assert.equal(registry.getKeysForClass('ChargeJob'), 'stripe')
    assert.equal(registry.getKeysForClass('PlainJob'), undefined)
    assert.deepEqual(registry.getAllKeys(), ['stripe'])
    assert.ok(registry.getStrategy('stripe') instanceof StaticRateStrategy)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no `PgbossRateLimitRegistry`.

- [ ] **Step 3: Implement**

Create `lib/rate-limit/rate-limit.registry.ts`:

```ts
import { Injectable, Logger } from '@nestjs/common'
import { ProvidersExplorer } from '../providers/providers-explorer.js'
import { RateLimitConfig } from './rate-limit-config.js'
import { getRateLimitMetadata } from './rate-limit.decorator.js'
import { RateLimitStrategy } from './rate-limit.strategy.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'

@Injectable()
export class PgbossRateLimitRegistry {
  private readonly logger = new Logger(PgbossRateLimitRegistry.name)
  private readonly classToKey = new Map<string, string>()
  private readonly keyToConfig = new Map<string, RateLimitConfig>()
  private readonly keyToStrategy = new Map<string, RateLimitStrategy>()

  constructor (private readonly providerExplorer: ProvidersExplorer) {}

  onModuleInit (): void {
    for (const provider of this.providerExplorer.providers) {
      const meta = getRateLimitMetadata(provider.providerClass)

      if (meta === undefined) {
        continue
      }

      this.classToKey.set(provider.providerClass.name, meta.key)

      if (!this.keyToStrategy.has(meta.key)) {
        this.keyToConfig.set(meta.key, meta.config)
        this.keyToStrategy.set(meta.key, this.buildStrategy(meta.config))
        this.logger.log(`Registered rate limit '${meta.key}' (${meta.config.source})`)
      }
    }
  }

  getKeysForClass (className: string): string | undefined {
    return this.classToKey.get(className)
  }

  getStrategy (key: string): RateLimitStrategy | undefined {
    return this.keyToStrategy.get(key)
  }

  getConfig (key: string): RateLimitConfig | undefined {
    return this.keyToConfig.get(key)
  }

  getAllKeys (): string[] {
    return [...this.keyToStrategy.keys()]
  }

  private buildStrategy (config: RateLimitConfig): RateLimitStrategy {
    switch (config.source) {
      case 'static':
        return new StaticRateStrategy(config)
      default:
        // Header/failure strategies are added in Phase 2; until then treat as
        // never-blocking so a queue is never wedged by an unimplemented mode.
        return { isBlocked: () => false }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit/rate-limit.registry.ts lib/rate-limit/rate-limit.registry.test.ts
git commit -m "feat(rate-limit): registry scanning @RateLimited providers"
```

---

### Task 6: `PgbossRateLimiter` — blockedKeys + consume

**Files:**
- Create: `lib/rate-limit/rate-limiter.ts`
- Test: `lib/rate-limit/rate-limiter.test.ts`

**Interfaces:**
- Consumes: `PgbossRateLimitRegistry` (Task 5), `RateLimitStore` (Task 4).
- Produces:
  - `class PgbossRateLimiter` with:
    - `onModuleInit(): Promise<void>` — calls `store.ensureSchema()`
    - `blockedKeys(): Promise<string[]>` — every registered key currently blocked
    - `consumeForClass(className: string): Promise<void>` — consume one token for the key governing that job class, if static
    - `reportForClass(className: string, signal: RateLimitSignal): Promise<void>` — Phase 2 no-op stub for static; real for header/failure

- [ ] **Step 1: Write the failing test**

Create `lib/rate-limit/rate-limiter.test.ts` with a fake store + a real static strategy via a hand-built registry double.

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgbossRateLimiter } from './rate-limiter.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'
import { RateLimitBucketRow } from './rate-limit.strategy.js'
import { RateLimitStore } from './rate-limit.store.js'

class FakeStore extends RateLimitStore {
  rows = new Map<string, RateLimitBucketRow>()
  consumed: string[] = []
  grant = true
  async ensureSchema () {}
  async getMany (keys: string[]) { return keys.map(k => this.rows.get(k)).filter(Boolean) as RateLimitBucketRow[] }
  async tryConsumeToken (key: string) { this.consumed.push(key); return this.grant }
  async setBlockedUntil () {}
  async setHeaderState () {}
}

const config = { source: 'static' as const, limit: 3, windowSeconds: 60 }
function registryDouble () {
  return {
    getAllKeys: () => ['stripe'],
    getKeysForClass: (c: string) => (c === 'ChargeJob' ? 'stripe' : undefined),
    getStrategy: () => new StaticRateStrategy(config),
    getConfig: () => config
  } as never
}

describe('PgbossRateLimiter', () => {
  it('reports a key as blocked when its stored row is exhausted', async () => {
    const store = new FakeStore()
    store.rows.set('stripe', { key: 'stripe', tokens: 0, windowStartAt: new Date(), resetAt: null, blockedUntil: null })
    const limiter = new PgbossRateLimiter(registryDouble(), store)

    assert.deepEqual(await limiter.blockedKeys(), ['stripe'])
  })

  it('does not block when budget remains', async () => {
    const store = new FakeStore()
    const limiter = new PgbossRateLimiter(registryDouble(), store)
    assert.deepEqual(await limiter.blockedKeys(), [])
  })

  it('consumes a token for the class key', async () => {
    const store = new FakeStore()
    const limiter = new PgbossRateLimiter(registryDouble(), store)
    await limiter.consumeForClass('ChargeJob')
    assert.deepEqual(store.consumed, ['stripe'])
  })

  it('ignores classes with no rate limit on consume', async () => {
    const store = new FakeStore()
    const limiter = new PgbossRateLimiter(registryDouble(), store)
    await limiter.consumeForClass('PlainJob')
    assert.deepEqual(store.consumed, [])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no `PgbossRateLimiter`.

- [ ] **Step 3: Implement**

Create `lib/rate-limit/rate-limiter.ts`:

```ts
import { Injectable, Logger } from '@nestjs/common'
import { RateLimitSignal } from './rate-limit-config.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { RateLimitStore } from './rate-limit.store.js'

@Injectable()
export class PgbossRateLimiter {
  private readonly logger = new Logger(PgbossRateLimiter.name)

  constructor (
    private readonly registry: PgbossRateLimitRegistry,
    private readonly store: RateLimitStore
  ) {}

  async onModuleInit (): Promise<void> {
    await this.store.ensureSchema()
  }

  /** Fetch-gate: which registered keys are blocked right now. Fail-open on error. */
  async blockedKeys (): Promise<string[]> {
    const keys = this.registry.getAllKeys()

    if (keys.length === 0) {
      return []
    }

    try {
      const rows = await this.store.getMany(keys)
      const byKey = new Map(rows.map(r => [r.key, r]))
      const now = new Date()
      const blocked: string[] = []

      for (const key of keys) {
        const strategy = this.registry.getStrategy(key)
        if (strategy?.isBlocked(byKey.get(key) ?? null, now) === true) {
          blocked.push(key)
        }
      }

      return blocked
    } catch (error) {
      this.logger.error('blockedKeys failed; failing open', error as Error)
      return []
    }
  }

  /** Execution: count one usage against the job class's static budget. */
  async consumeForClass (className: string): Promise<void> {
    const key = this.registry.getKeysForClass(className)
    if (key === undefined) {
      return
    }

    const config = this.registry.getConfig(key)
    if (config?.source !== 'static') {
      return
    }

    await this.store.tryConsumeToken(key, config.limit, config.windowSeconds)
  }

  /** Execution feedback for header/failure modes. Static: no-op. (Phase 2.) */
  async reportForClass (_className: string, _signal: RateLimitSignal): Promise<void> {
    // Implemented in Phase 2 (Task 12).
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit/rate-limiter.ts lib/rate-limit/rate-limiter.test.ts
git commit -m "feat(rate-limit): limiter blockedKeys and consume"
```

---

### Task 7: Carry `groupId` through enqueue

**Files:**
- Modify: `lib/jobs/serialized-job.ts`
- Modify: `lib/scheduler/pgboss-scheduler.ts:75-97` (`serializeJob`)
- Test: `lib/scheduler/serialize-group.test.ts`

**Interfaces:**
- Consumes: `getRateLimitMetadata` (Task 1).
- Produces: `SerializedJob` gains an optional top-level `groupId?: string`.

- [ ] **Step 1: Write the failing test**

The `serializeJob` method is private. Add a test-only path by extracting the group-resolution into a tiny exported pure helper and testing that. Create `lib/scheduler/resolve-group-id.ts`:

```ts
import { getRateLimitMetadata } from '../rate-limit/rate-limit.decorator.js'

export function resolveGroupId (jobConstructor: object): string | undefined {
  return getRateLimitMetadata(jobConstructor)?.key
}
```

Create `lib/scheduler/serialize-group.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { BaseJob } from '../jobs/base-job.js'
import { RateLimited } from '../rate-limit/rate-limit.decorator.js'
import { resolveGroupId } from './resolve-group-id.js'

@RateLimited('stripe', { source: 'static', limit: 10, windowSeconds: 60 })
class ChargeJob extends BaseJob {}
class PlainJob extends BaseJob {}

describe('resolveGroupId', () => {
  it('returns the rate-limit key for a decorated job', () => {
    assert.equal(resolveGroupId(ChargeJob), 'stripe')
  })
  it('returns undefined for an undecorated job', () => {
    assert.equal(resolveGroupId(PlainJob), undefined)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — no `resolve-group-id.js`.

- [ ] **Step 3: Add `groupId` to `SerializedJob`**

Edit `lib/jobs/serialized-job.ts` — add the field to the interface body:

```ts
export interface SerializedJob<T extends BaseJob = BaseJob>
  extends JobInsert<SerializedJobData<T>> {
  name: string
  groupId?: string
}
```

- [ ] **Step 4: Populate it in `serializeJob`**

In `lib/scheduler/pgboss-scheduler.ts`, add the import at the top:

```ts
import { resolveGroupId } from './resolve-group-id.js'
```

Then in `serializeJob` (currently returns the object at ~L79-96), add `groupId` to the returned object:

```ts
    return {
      name: queue,
      groupId: resolveGroupId(job.constructor),
      data: {
        className,
        classData: job.data,
        traceContext: context ?? {}
      },
      priority: job.options?.priority,
      // ...unchanged fields...
      retentionSeconds: job.options?.retentionSeconds
    }
```

(pg-boss's bulk `insert` reads the top-level `"groupId"` column from each job object — see Global Constraints.)

- [ ] **Step 5: Run tests + typecheck**

Run: `pnpm test`
Expected: PASS, build clean.

- [ ] **Step 6: Commit**

```bash
git add lib/jobs/serialized-job.ts lib/scheduler/resolve-group-id.ts lib/scheduler/pgboss-scheduler.ts lib/scheduler/serialize-group.test.ts
git commit -m "feat(rate-limit): tag enqueued jobs with rate-limit group id"
```

---

### Task 8: Gate `fetch` with `ignoreGroups`

**Files:**
- Modify: `lib/worker/pgboss-worker.ts:20-31` (constructor), `:75-116` (`fetchJobs`)
- Modify: `lib/worker/pgboss-worker-app.ts:13-30` (pass limiter into workers)
- Test: `lib/worker/worker-ignore-groups.test.ts`

**Interfaces:**
- Consumes: `PgbossRateLimiter.blockedKeys()` (Task 6).
- Produces: `PgBossWorker` constructor gains a trailing `rateLimiter: Pick<PgbossRateLimiter, 'blockedKeys'>` parameter; `fetch` is called with `{ batchSize, ignoreGroups }`.

- [ ] **Step 1: Write the failing test**

We test the fetch options assembly by giving the worker a fake client + fake limiter and asserting `ignoreGroups` is forwarded. Create `lib/worker/worker-ignore-groups.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgBossWorker } from './pgboss-worker.js'

describe('PgBossWorker fetch gating', () => {
  it('passes blockedKeys as ignoreGroups to client.fetch', async () => {
    const fetchCalls: Array<{ name: string, options: unknown }> = []

    const client = {
      fetch: async (name: string, options: unknown) => {
        fetchCalls.push({ name, options })
        return []
      }
    }
    const rateLimiter = { blockedKeys: async () => ['stripe'] }

    const worker = new PgBossWorker(
      { queueName: 'system', pollInterval: 1 },
      { canProceed: () => true },
      client as never,
      { } as never,
      rateLimiter as never
    )

    // fetchJobs() early-returns unless the worker is "working"; set the flag
    // directly since we call the private method without start()/threads.
    ;(worker as unknown as { working: boolean }).working = true
    await (worker as unknown as { fetchJobs: () => Promise<void> }).fetchJobs()

    assert.equal(fetchCalls.length, 1)
    assert.equal(fetchCalls[0].name, 'system')
    assert.deepEqual((fetchCalls[0].options as { ignoreGroups: string[] }).ignoreGroups, ['stripe'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — constructor arity / `ignoreGroups` not forwarded.

- [ ] **Step 3: Add the limiter to the worker**

In `lib/worker/pgboss-worker.ts`, import the type and extend the constructor:

```ts
import { PgbossRateLimiter } from '../rate-limit/rate-limiter.js'
```

Add the parameter (keep existing params, append last):

```ts
  constructor (
    config: PgbossWorkerQueueOptions,
    private bouncer: PgbossBouncer,
    private client: PgBossClient,
    private jobRegistry: JobRegistry,
    private rateLimiter: Pick<PgbossRateLimiter, 'blockedKeys'>
  ) {
```

In `fetchJobs`, compute the ignore list **before the `if (this.jobFetchingPromise != null)` de-dup guard** — never between that null-check and the `this.jobFetchingPromise = ...` assignment, because an `await` there would let two concurrent `fetchJobs()` calls both claim the slot and issue duplicate fetches (the method's own comment warns against exactly this). Place it right after the `canProceed()` block:

```ts
    if (!await this.bouncer.canProceed()) {
      await new Promise(resolve => setTimeout(resolve, this.pollInterval))

      return
    }

    const ignoreGroups = await this.rateLimiter.blockedKeys()

    // do not await between this if when null and the assignment of the jobFetchingPromise
    // to avoid multiple fetches in parallel
    if (this.jobFetchingPromise != null) {
      await this.jobFetchingPromise

      return
    }

    this.jobFetchingPromise = new Promise((resolve, reject) => {
      void this.client.fetch<RawPgBossJobData>(
        this.queueName,
        { batchSize: this.batchSize, ignoreGroups }
      )
```

- [ ] **Step 4: Wire it in the worker app**

In `lib/worker/pgboss-worker-app.ts`, inject the limiter and pass it when constructing workers:

```ts
import { PgbossRateLimiter } from '../rate-limit/rate-limiter.js'
```

Add `private rateLimiter: PgbossRateLimiter` to the constructor params, and update the `new PgBossWorker(...)` call (L24):

```ts
        const worker = new PgBossWorker(
          queueOptions, bouncer, this.client, this.jobRegistry, this.rateLimiter
        )
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/worker/pgboss-worker.ts lib/worker/pgboss-worker-app.ts lib/worker/worker-ignore-groups.test.ts
git commit -m "feat(rate-limit): gate fetch with ignoreGroups from limiter"
```

---

### Task 9: Auto-consume on success + module wiring + exports

**Files:**
- Modify: `lib/worker/pgboss-worker.thread.ts:10-28` (constructor + `run`)
- Modify: `lib/worker/pgboss-worker.ts:51-57` (pass limiter to threads)
- Create: `lib/rate-limit/rate-limit.module.ts`
- Modify: `lib/worker/pgboss-worker.module.ts` (provide rate-limit providers)
- Modify: `lib/index.ts` (exports)
- Test: `lib/worker/thread-consume.test.ts`

**Interfaces:**
- Consumes: `PgbossRateLimiter.consumeForClass` (Task 6).
- Produces: worker thread consumes one token after a successful handler run.

- [ ] **Step 1: Write the failing test**

Create `lib/worker/thread-consume.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgBossWorkerThread } from './pgboss-worker.thread.js'

describe('PgBossWorkerThread rate-limit accounting', () => {
  it('consumes one token after a successful job', async () => {
    const consumed: string[] = []
    const job = { id: '1', name: 'system', data: { className: 'ChargeJob', classData: {} } }

    async function* one () { yield job as never }

    const client = { complete: async () => {}, fail: async () => {} }
    const registry = { get: async () => ({ run: async () => {} }) }
    const rateLimiter = { consumeForClass: async (c: string) => { consumed.push(c) }, reportForClass: async () => {} }

    const thread = new PgBossWorkerThread(one(), client as never, registry as never, rateLimiter as never)
    await thread.run()

    assert.deepEqual(consumed, ['ChargeJob'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — thread constructor has no limiter / no consume call.

- [ ] **Step 3: Add limiter to the thread and consume on success**

In `lib/worker/pgboss-worker.thread.ts`, import and extend the constructor:

```ts
import { PgbossRateLimiter } from '../rate-limit/rate-limiter.js'
```

```ts
  constructor (
    private readonly queue: AsyncGenerator<RawPgBossJob, void, unknown>,
    private readonly client: PgBossClient,
    private readonly jobRegistry: JobRegistry,
    private readonly rateLimiter: Pick<PgbossRateLimiter, 'consumeForClass' | 'reportForClass'>
  ) {}
```

In `run()`, after a successful `handleJob` + `complete`, consume:

```ts
      try {
        const result = await this.handleJob(job)

        await this.client.complete(job.name, job.id, result ?? undefined)
        await this.rateLimiter.consumeForClass(job.data.className)
      } catch (error) {
        captureException(error)
        await this.client.fail(job.name, job.id, { error }).catch(() => {})
      }
```

- [ ] **Step 4: Pass the limiter from worker to threads**

In `lib/worker/pgboss-worker.ts`, `startWorkerThreads` (L51-57) — pass `this.rateLimiter`:

```ts
      const thread = new PgBossWorkerThread(jobGenerator, this.client, this.jobRegistry, this.rateLimiter)
```

The worker's `rateLimiter` param type must now include `consumeForClass`/`reportForClass`; widen it:

```ts
    private rateLimiter: Pick<PgbossRateLimiter, 'blockedKeys' | 'consumeForClass' | 'reportForClass'>
```

Update Task 8's test double to add `consumeForClass`/`reportForClass` no-ops if the test constructs a thread (it does not — only `fetchJobs` — so no change needed there).

- [ ] **Step 5: Create the module and wire providers**

Create `lib/rate-limit/rate-limit.module.ts`:

```ts
import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '../providers/providers-explorer.module.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { PgbossRateLimiter } from './rate-limiter.js'
import { RateLimitStore } from './rate-limit.store.js'
import { PostgresRateLimitStore } from './postgres-rate-limit.store.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [
    PgbossRateLimitRegistry,
    PgbossRateLimiter,
    { provide: RateLimitStore, useClass: PostgresRateLimitStore }
  ],
  exports: [PgbossRateLimiter, PgbossRateLimitRegistry]
})
export class PgbossRateLimitModule {}
```

In `lib/worker/pgboss-worker.module.ts`, import `PgbossRateLimitModule` and ensure `PgbossRateLimiter` is available to `PgbossWorkerApp` (add to that module's `imports`). Match the existing module wiring style in that file.

- [ ] **Step 6: Export the public surface**

In `lib/index.ts`, add:

```ts
// Rate limiting
export { RateLimited } from './rate-limit/rate-limit.decorator.js'
export {
  RateLimitConfig, StaticRateLimitConfig, HeaderRateLimitConfig,
  FailureBackoffConfig, RateLimitSignal
} from './rate-limit/rate-limit-config.js'
export { PgbossRateLimiter } from './rate-limit/rate-limiter.js'
export { PgbossRateLimitModule } from './rate-limit/rate-limit.module.js'
```

- [ ] **Step 7: Run tests + build**

Run: `pnpm test`
Expected: PASS across the suite; build clean.

- [ ] **Step 8: Commit**

```bash
git add lib/worker/pgboss-worker.thread.ts lib/worker/pgboss-worker.ts lib/rate-limit/rate-limit.module.ts lib/worker/pgboss-worker.module.ts lib/index.ts lib/worker/thread-consume.test.ts
git commit -m "feat(rate-limit): auto-consume on success, module wiring, exports"
```

---

**Phase 1 checkpoint:** Static-rate limiting works end-to-end. A job decorated `@RateLimited('x', { source: 'static', limit, windowSeconds })` is tagged with group `x`, the worker skips fetching group `x` once the bucket is empty, and each successful job consumes a token. Verify with a real consumer before Phase 2 (see Rollout in the spec).

---

## Phase 2 — Header and failure-backoff modes

### Task 10: Header strategy + signal parsing

**Files:**
- Create: `lib/rate-limit/strategies/header-rate.strategy.ts`
- Create: `lib/rate-limit/parse-rate-limit-headers.ts`
- Test: `lib/rate-limit/strategies/header-rate.strategy.test.ts`
- Test: `lib/rate-limit/parse-rate-limit-headers.test.ts`

**Interfaces:**
- Consumes: `RateLimitBucketRow`, `RateLimitStrategy`, `HeaderRateLimitConfig`, `RateLimitSignal`.
- Produces:
  - `class HeaderRateStrategy implements RateLimitStrategy` — `isBlocked`: blocked when `tokens != null && tokens <= 0 && resetAt != null && now < resetAt`.
  - `function parseRateLimitHeaders(headers: Record<string, string | undefined>, config: HeaderRateLimitConfig): RateLimitSignal`

- [ ] **Step 1: Write the failing tests**

`lib/rate-limit/strategies/header-rate.strategy.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { HeaderRateStrategy } from './header-rate.strategy.js'

const strategy = new HeaderRateStrategy({ source: 'headers' })
const now = new Date('2026-07-03T10:00:00Z')

describe('HeaderRateStrategy.isBlocked', () => {
  it('not blocked when no state known', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })
  it('blocked when remaining 0 and reset in the future', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: null, resetAt: new Date('2026-07-03T10:00:30Z'), blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), true)
  })
  it('not blocked once reset has passed', () => {
    const row = { key: 'k', tokens: 0, windowStartAt: null, resetAt: new Date('2026-07-03T09:59:59Z'), blockedUntil: null }
    assert.equal(strategy.isBlocked(row, now), false)
  })
})
```

`lib/rate-limit/parse-rate-limit-headers.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseRateLimitHeaders } from './parse-rate-limit-headers.js'

describe('parseRateLimitHeaders', () => {
  it('reads standard X-RateLimit headers', () => {
    const sig = parseRateLimitHeaders(
      { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1751536830' },
      { source: 'headers' }
    )
    assert.equal(sig.remaining, 0)
    assert.ok(sig.resetAt instanceof Date)
  })

  it('reads Retry-After seconds on 429', () => {
    const sig = parseRateLimitHeaders({ 'retry-after': '30' }, { source: 'headers' })
    assert.equal(sig.retryAfterSeconds, 30)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test`
Expected: FAIL — modules missing.

- [ ] **Step 3: Implement the parser**

Create `lib/rate-limit/parse-rate-limit-headers.ts`:

```ts
import { HeaderRateLimitConfig, RateLimitSignal } from './rate-limit-config.js'

export function parseRateLimitHeaders (
  headers: Record<string, string | undefined>,
  config: HeaderRateLimitConfig
): RateLimitSignal {
  const remainingKey = (config.remainingHeader ?? 'x-ratelimit-remaining').toLowerCase()
  const resetKey = (config.resetHeader ?? 'x-ratelimit-reset').toLowerCase()
  const retryAfterKey = (config.retryAfterHeader ?? 'retry-after').toLowerCase()

  const signal: RateLimitSignal = {}

  const remaining = headers[remainingKey]
  if (remaining !== undefined) {
    signal.remaining = Number(remaining)
  }

  const reset = headers[resetKey]
  if (reset !== undefined) {
    // Epoch seconds per the common convention.
    signal.resetAt = new Date(Number(reset) * 1000)
  }

  const retryAfter = headers[retryAfterKey]
  if (retryAfter !== undefined) {
    signal.retryAfterSeconds = Number(retryAfter)
  }

  return signal
}
```

- [ ] **Step 4: Implement the strategy**

Create `lib/rate-limit/strategies/header-rate.strategy.ts`:

```ts
import { HeaderRateLimitConfig } from '../rate-limit-config.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export class HeaderRateStrategy implements RateLimitStrategy {
  constructor (private readonly _config: HeaderRateLimitConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    if (row?.tokens == null || row.resetAt == null) {
      return false
    }

    return row.tokens <= 0 && now < row.resetAt
  }
}
```

- [ ] **Step 5: Run to verify pass**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/rate-limit/strategies/header-rate.strategy.ts lib/rate-limit/parse-rate-limit-headers.ts lib/rate-limit/strategies/header-rate.strategy.test.ts lib/rate-limit/parse-rate-limit-headers.test.ts
git commit -m "feat(rate-limit): header strategy and header parsing"
```

---

### Task 11: Failure-backoff strategy

**Files:**
- Create: `lib/rate-limit/strategies/failure-backoff.strategy.ts`
- Test: `lib/rate-limit/strategies/failure-backoff.strategy.test.ts`

**Interfaces:**
- Produces:
  - `class FailureBackoffStrategy implements RateLimitStrategy` — `isBlocked`: `row?.blockedUntil != null && now < row.blockedUntil`.
  - `function nextBackoff(config: FailureBackoffConfig, signal: RateLimitSignal, now: Date): Date` — `now + max(retryAfterSeconds, backoffSeconds)` capped at `maxBackoffSeconds`.

- [ ] **Step 1: Write the failing test**

Create `lib/rate-limit/strategies/failure-backoff.strategy.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { FailureBackoffStrategy, nextBackoff } from './failure-backoff.strategy.js'

const config = { source: 'failure' as const, backoffSeconds: 10, maxBackoffSeconds: 60 }
const strategy = new FailureBackoffStrategy(config)
const now = new Date('2026-07-03T10:00:00Z')

describe('FailureBackoffStrategy', () => {
  it('not blocked when no cooldown set', () => {
    assert.equal(strategy.isBlocked(null, now), false)
  })
  it('blocked while blocked_until is in the future', () => {
    const row = { key: 'k', tokens: null, windowStartAt: null, resetAt: null, blockedUntil: new Date('2026-07-03T10:00:05Z') }
    assert.equal(strategy.isBlocked(row, now), true)
  })
  it('nextBackoff prefers retryAfter and caps at max', () => {
    assert.equal(nextBackoff(config, { retryAfterSeconds: 120 }, now).toISOString(), '2026-07-03T10:01:00.000Z')
    assert.equal(nextBackoff(config, {}, now).toISOString(), '2026-07-03T10:00:10.000Z')
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm test`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement**

Create `lib/rate-limit/strategies/failure-backoff.strategy.ts`:

```ts
import { FailureBackoffConfig, RateLimitSignal } from '../rate-limit-config.js'
import { RateLimitBucketRow, RateLimitStrategy } from '../rate-limit.strategy.js'

export function nextBackoff (
  config: FailureBackoffConfig,
  signal: RateLimitSignal,
  now: Date
): Date {
  const requested = signal.retryAfterSeconds ?? config.backoffSeconds
  const capped = config.maxBackoffSeconds != null
    ? Math.min(requested, config.maxBackoffSeconds)
    : requested

  return new Date(now.getTime() + capped * 1000)
}

export class FailureBackoffStrategy implements RateLimitStrategy {
  constructor (private readonly _config: FailureBackoffConfig) {}

  isBlocked (row: RateLimitBucketRow | null, now: Date): boolean {
    return row?.blockedUntil != null && now < row.blockedUntil
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/rate-limit/strategies/failure-backoff.strategy.ts lib/rate-limit/strategies/failure-backoff.strategy.test.ts
git commit -m "feat(rate-limit): failure-backoff strategy"
```

---

### Task 12: Wire header/failure strategies + `report` feedback

**Files:**
- Modify: `lib/rate-limit/rate-limit.registry.ts` (`buildStrategy` switch)
- Modify: `lib/rate-limit/rate-limiter.ts` (`reportForClass`)
- Create: `lib/rate-limit/rate-limit.error.ts`
- Modify: `lib/worker/pgboss-worker.thread.ts` (`report` on `RateLimitError`)
- Test: `lib/rate-limit/rate-limiter-report.test.ts`

**Interfaces:**
- Consumes: `HeaderRateStrategy` (Task 10), `FailureBackoffStrategy` + `nextBackoff` (Task 11).
- Produces:
  - `class RateLimitError extends Error { constructor(signal: RateLimitSignal) }` carrying `.signal`.
  - `PgbossRateLimiter.reportForClass(className, signal)` persists header/failure state.

- [ ] **Step 1: Complete the strategy switch**

Edit `buildStrategy` in `lib/rate-limit/rate-limit.registry.ts`:

```ts
  private buildStrategy (config: RateLimitConfig): RateLimitStrategy {
    switch (config.source) {
      case 'static':
        return new StaticRateStrategy(config)
      case 'headers':
        return new HeaderRateStrategy(config)
      case 'failure':
        return new FailureBackoffStrategy(config)
    }
  }
```

Add the imports for `HeaderRateStrategy` and `FailureBackoffStrategy`.

- [ ] **Step 2: Write the failing test**

Create `lib/rate-limit/rate-limiter-report.test.ts`:

```ts
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { PgbossRateLimiter } from './rate-limiter.js'
import { RateLimitStore } from './rate-limit.store.js'
import { RateLimitBucketRow } from './rate-limit.strategy.js'

class RecordingStore extends RateLimitStore {
  blocked: Array<[string, Date]> = []
  header: Array<[string, number, Date | null]> = []
  async ensureSchema () {}
  async getMany () { return [] as RateLimitBucketRow[] }
  async tryConsumeToken () { return true }
  async setBlockedUntil (key: string, until: Date) { this.blocked.push([key, until]) }
  async setHeaderState (key: string, remaining: number, resetAt: Date | null) { this.header.push([key, remaining, resetAt]) }
}

const failureConfig = { source: 'failure' as const, backoffSeconds: 10 }
const headerConfig = { source: 'headers' as const }

function registryDouble (key: string, config: unknown) {
  return {
    getAllKeys: () => [key],
    getKeysForClass: () => key,
    getStrategy: () => ({ isBlocked: () => false }),
    getConfig: () => config
  } as never
}

describe('PgbossRateLimiter.reportForClass', () => {
  it('sets a cooldown for failure mode on throttle', async () => {
    const store = new RecordingStore()
    const limiter = new PgbossRateLimiter(registryDouble('flaky', failureConfig), store)
    await limiter.reportForClass('Job', { throttled: true, retryAfterSeconds: 5 })
    assert.equal(store.blocked.length, 1)
    assert.equal(store.blocked[0][0], 'flaky')
  })

  it('stores header state for header mode', async () => {
    const store = new RecordingStore()
    const limiter = new PgbossRateLimiter(registryDouble('cuopt', headerConfig), store)
    const resetAt = new Date('2026-07-03T10:00:30Z')
    await limiter.reportForClass('Job', { remaining: 0, resetAt })
    assert.deepEqual(store.header[0], ['cuopt', 0, resetAt])
  })
})
```

- [ ] **Step 3: Run to verify failure**

Run: `pnpm test`
Expected: FAIL — `reportForClass` is a no-op.

- [ ] **Step 4: Implement `reportForClass`**

Replace the stub in `lib/rate-limit/rate-limiter.ts`. Add imports for `nextBackoff` and update the method:

```ts
import { nextBackoff } from './strategies/failure-backoff.strategy.js'
```

```ts
  async reportForClass (className: string, signal: RateLimitSignal): Promise<void> {
    const key = this.registry.getKeysForClass(className)
    if (key === undefined) {
      return
    }

    const config = this.registry.getConfig(key)

    if (config?.source === 'failure' && signal.throttled === true) {
      await this.store.setBlockedUntil(key, nextBackoff(config, signal, new Date()))
      return
    }

    if (config?.source === 'headers' && signal.remaining !== undefined) {
      await this.store.setHeaderState(key, signal.remaining, signal.resetAt ?? null)
    }
  }
```

- [ ] **Step 5: Add `RateLimitError` and report from the thread**

Create `lib/rate-limit/rate-limit.error.ts`:

```ts
import { RateLimitSignal } from './rate-limit-config.js'

/** Throw from a handler when the API signalled a rate limit (e.g. a 429). */
export class RateLimitError extends Error {
  constructor (readonly signal: RateLimitSignal) {
    super('Rate limit reached')
    this.name = 'RateLimitError'
  }
}
```

In `lib/worker/pgboss-worker.thread.ts` `run()`, report on `RateLimitError` before failing (so header/failure state updates even though the job errors):

```ts
import { RateLimitError } from '../rate-limit/rate-limit.error.js'
```

```ts
      } catch (error) {
        if (error instanceof RateLimitError) {
          await this.rateLimiter.reportForClass(job.data.className, error.signal).catch(() => {})
        }
        captureException(error)
        await this.client.fail(job.name, job.id, { error }).catch(() => {})
      }
```

Export `RateLimitError` from `lib/index.ts`:

```ts
export { RateLimitError } from './rate-limit/rate-limit.error.js'
```

- [ ] **Step 6: Run tests + build**

Run: `pnpm test`
Expected: PASS across the suite; build clean.

- [ ] **Step 7: Commit**

```bash
git add lib/rate-limit/rate-limit.registry.ts lib/rate-limit/rate-limiter.ts lib/rate-limit/rate-limit.error.ts lib/worker/pgboss-worker.thread.ts lib/index.ts lib/rate-limit/rate-limiter-report.test.ts
git commit -m "feat(rate-limit): header/failure strategies and report feedback"
```

---

### Task 13: README documentation

**Files:**
- Modify: `README.md`

**Interfaces:** none.

- [ ] **Step 1: Document the feature**

Add a "Rate limiting" section to `README.md` covering:
- `@RateLimited(key, config)` on a job class, with one example per mode:
  - `{ source: 'static', limit: 100, windowSeconds: 60 }`
  - `{ source: 'headers' }` + calling `throw new RateLimitError(parseRateLimitHeaders(res.headers, config))` / reporting from the handler
  - `{ source: 'failure', backoffSeconds: 30 }` + `throw new RateLimitError({ throttled: true })` on a 429
- How gating works (jobs stay `created`, other groups still drain).
- The overshoot caveat (bounded by `batchSize × workers`; lower `batchSize` for hot queues).
- That `PgbossRateLimitModule` must be imported by the worker app module.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(rate-limit): document @RateLimited usage"
```

---

## Self-review notes

- **Spec coverage:** decorator (§5, Task 1); three strategies + reset (§6, Tasks 3/10/11); shared Postgres keyed state + atomicity (§4/§7, Task 4); registry scan (§4, Task 5); limiter blockedKeys/consume/report (§4, Tasks 6/12); enqueue groupId (§7.1, Task 7); fetch ignoreGroups (§7.3, Task 8); execution accounting (§7.4, Tasks 9/12); module + exports (§7.5, Task 9); overshoot decision (§8, README Task 13); backward compat (bouncer untouched — Global Constraints); testing (§9, per-task tests).
- **Spec §7.2 resolved:** the bouncer interface is left unchanged; the worker consults the limiter directly. Documented in Global Constraints.
- **Config surface refined from spec §6:** the sketch `{ perMinute: 100 }` is made explicit as `{ source: 'static', limit, windowSeconds }` (discriminated by `source`). A `perMinute`/`perSecond` sugar helper is optional future work, not required.
- **Type consistency:** `RateLimitBucketRow`, `RateLimitStrategy.isBlocked(row, now)`, `RateLimitStore` method signatures, and `PgbossRateLimiter.{blockedKeys,consumeForClass,reportForClass}` are used identically across all tasks.
- **Deferred to Phase 2 intentionally:** header/failure strategies return a never-blocking stub from the registry until Task 12 wires them, so Phase 1 is shippable without wedging any queue.
