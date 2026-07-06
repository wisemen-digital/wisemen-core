# PGBoss NestJS

This package provides NestJS integration for PgBoss job queuing and processing.

## Scheduling Jobs

To schedule jobs, you can use the `PgBossScheduler` which provides methods to schedule jobs to be processed by workers.

### 1. Create a job data type:

```ts
export interface MyJobData extends BaseJobData {
  uuid: string;
  // other data here
}

@PgBossJob("queue-name")
export class MyJob extends BaseJob<MyJobData> {
  constructor(uuid: string) {
    super({ uuid });
  }
}
```

### 2. Schedule the job using the `PgBossScheduler`:

```ts
import { PgBossScheduler } from "@wisemen/pgboss-nestjs-job";

@Injectable()
export class MyService {
  constructor(private readonly jobScheduler: PgBossScheduler) {}
  async scheduleMyJob(data: MyJobData, options?: PgBossScheduleOptions) {
    await this.jobScheduler.scheduleJob(new MyJob(data), options);
  }
}
```

### 3. Import the `PgBossSchedulerModule`:

You must provide database connection options to the `PgBossSchedulerModule` when importing it into your module.

```ts
@Module({
  imports: [
    PgBossSchedulerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionString: configService.getOrThrow("DATABASE_URI"),
      }),
    }),
  ],
  providers: [MyService],
})
export class SomeModule {}
```

## Worker Setup

In order to process jobs, you need to set up a worker application that listens to a specific queue and handles the jobs.

### 1. Create an entrypoint that creates an NestJs application context instance that contains the `PgBossWorkerModule`.

The `PgBossWorkerModule` accepts various configuration options to customize its behavior.

- `dataBaseOptions` (required): Database connection options for PgBoss.
- `queueName` (required): The name of the queue to listen to.
- `concurrency` (optional): The number of jobs to process concurrently (default is 1).
- `pollInterval` (optional): The interval (in milliseconds) to poll for new jobs (default is 1000 ms).
- `batchSize` (optional): The number of jobs to fetch in each batch (default is 1).
- `fetchRefreshThreshold` (optional): The threshold to refresh job fetching (default is 5000 ms).
- `bouncerModule` (optional): A module that provides a `QueueBouncer` to control job fetching.

```ts
@Module({
  imports: [
    AppModule.forRoot(),
    PgBossWorkerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dataBaseOptions: {
          connectionString: configService.getOrThrow("DATABASE_URI"),
        },
        queueName,
        concurrency, // The number of jobs to process concurrently
        batchSize, // The number of jobs to fetch
        fetchRefreshThreshold, // Refresh threshold to fetch jobs
        pollInterval, // The interval (in milliseconds) to poll for new jobs
        bouncerModule, // An optional bouncer which will prevent jobs from being fetched (see QueueBouncer section below)
      }),
    }),
  ],
})
class WorkerModule {}

class Worker extends WorkerContainer {
  async bootstrap(): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(WorkerModule);
  }
}

const _worker = new Worker();
```

#### QueueBouncer

Some workers / queues only need to run when some external service is online. The `QueueBouncer` base class is used by workers to determine wether they should poll for jobs or not by calling the `canProceed` method on the bouncer. This method typically performs the health check on an external service.

The queuebouncer is provided to the worker by creating and exportin a provider for the `QueueBouncer` class. An example module can be:

```
@Module({
  imports: [CuoptClientModule],
  providers: [{
    provide: QueueBouncer,
    useClass: CuoptWorkerBouncer
  }],
  exports: [QueueBouncer]
})
export class CuoptWorkerBouncerModule {}

```

When no bouncer is set, the package will default to `AllowBouncer` which never blocks a worker / queue from polling for jobs.

An example of a bouncer for an external cuopt system.

```typescript
@Injectable()
export class CuoptWorkerBouncer extends QueueBouncer {
  private isCuoptRunning: boolean;
  private lastPolledAt: Date;
  private pollPromise: Promise<boolean> | undefined;

  constructor(private cuopt: CuoptClient) {
    super();
  }

  async canProceed(): Promise<boolean> {
    if (dayjs().diff(this.lastPolledAt, "seconds") > 2) {
      await this.pollCuopt();
    }

    return this.isCuoptRunning;
  }

  private async pollCuopt() {
    if (this.pollPromise !== undefined) {
      await this.pollPromise;
      return;
    }

    this.pollPromise = this.cuopt.isReady();

    try {
      this.isCuoptRunning = await this.pollPromise;
    } catch {
      this.isCuoptRunning = false;
    } finally {
      this.lastPolledAt = new Date();
    }
  }
}
```

## Rate limiting

Some jobs call an external API that has its own rate limit. Rate limiting lets the worker stop fetching those jobs once the limit is exhausted, instead of fetching them and having them fail (or hammering the external API).

It has two halves:

1. **Declare the limits centrally**, once per API, in the worker's `rateLimits` config (keyed by a rate-limit key).
2. **Opt a job into a limit** by tagging it with that key via `super(data, { rateLimited: key })`.

The config lives with the worker (not on each job class) because a rate limit is a property of the downstream API, shared by every job that calls it. The key rides with the job as a pg-boss group id, so the worker gates fetching and counts usage without any job-class discovery.

### Declaring limits (worker config)

```ts
PgBossWorkerModule.forRoot({
  queues: [{ queueName: "queue-name" }],
  pgBossOptions: { /* ... */ },
  rateLimits: {
    "my-external-api": { source: "static", limit: 100, windowSeconds: 60 },
  },
});
```

`forRootAsync` accepts `rateLimits` as a static field alongside `inject`/`useFactory`:

```ts
PgBossWorkerModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({ pgBossOptions: { /* ... */ } }),
  rateLimits: {
    "my-external-api": { source: "static", limit: 100, windowSeconds: 60 },
  },
});
```

### Opting a job in

```ts
import { PgBossJob, BaseJob, BaseJobData } from "@wisemen/pgboss-nestjs-job";

export interface MyApiJobData extends BaseJobData {
  uuid: string;
}

@PgBossJob("queue-name")
export class MyApiJob extends BaseJob<MyApiJobData> {
  constructor(uuid: string) {
    super({ uuid }, { rateLimited: "my-external-api" });
  }
}
```

The key identifies the shared limit bucket: jobs from different classes share a budget by using the same key. Jobs that hit the same API from different queues also share the one budget, since the config is keyed globally. `source` is a discriminated union with three modes (covered below).

### Instrumenting API calls

Accounting — counting usage, reading limit headers, reacting to 429s — happens **at the HTTP call**, via interceptors on a [`@wisemen/node-fetch`](../node-fetch) client. Register them once with `useRateLimiting(client, rateLimiter)`, then make the job's API calls through that client:

```ts
import { Injectable } from "@nestjs/common";
import { createClient } from "@wisemen/node-fetch";
import {
  JobHandler, PgBossJobHandler, PgbossRateLimiter, useRateLimiting,
} from "@wisemen/pgboss-nestjs-job";

@Injectable()
@PgBossJobHandler(MyApiJob)
export class MyApiJobHandler extends JobHandler<MyApiJob> {
  private readonly api = createClient({ baseUrl: "https://api.example.com" });

  constructor(rateLimiter: PgbossRateLimiter) {
    super();
    useRateLimiting(this.api, rateLimiter);
  }

  async run(data: MyApiJobData): Promise<void> {
    const res = await this.api.get("/resource");
    // ...handle the response — no manual limiter calls needed
  }
}
```

While a rate-limited job runs, every request the instrumented client makes is attributed to that job's key automatically (through async context) — no key threading, no manual limiter calls. Requests made **outside** a rate-limited job are left untouched, so the client is safe to share. What each mode does with those requests:

> **Important:** accounting only happens for calls that go through an instrumented client. A rate-limited job that calls a bare `fetch` (or any un-instrumented client) will **not** be counted, and its key will never be gated. Route all of a rate-limited job's API calls through a `useRateLimiting` client.

### `static`: a known, fixed budget

```ts
{ source: "static", limit: 100, windowSeconds: 60 } // 100 requests per 60s window
```

Each request the instrumented client sends consumes one token from the shared budget, counted per **request attempt** — so retries and requests that end up failing still count, because they still hit the API. Once the window's tokens are exhausted, the worker stops fetching jobs for this key until the window rolls over.

### `headers`: the API reports its own limit via response headers

```ts
{ source: "headers", remainingHeader?: string, resetHeader?: string, retryAfterHeader?: string }
```

The headers default to `x-ratelimit-remaining`, `x-ratelimit-reset` (epoch seconds) and `retry-after`, and can be overridden per config. On **every** response the interceptor records the API's reported remaining/reset, so exhaustion is tracked proactively — not discovered one request too late on a failure. When the API reports the budget is spent, jobs for this key stop being fetched until the reset passes.

### `failure`: no header/limit info, only a backoff after a rejection

```ts
{ source: "failure", backoffSeconds: 30, maxBackoffSeconds?: number }
```

Use this when the API gives no usable rate-limit metadata, only a rejection. On a `429` the interceptor blocks the key and throws a `RateLimitError`, so the current job fails and retries after the block clears; a transport error (network failure/abort) is treated the same way. The block lasts `backoffSeconds` — or the response's `Retry-After` if present — capped at `maxBackoffSeconds`. Note: `backoffSeconds` is your own fixed guess for an API that gives no metadata; it is **not** derived from the server (unless `Retry-After` is present) and does **not** grow on repeated throttling.

You can still `throw new RateLimitError({ throttled: true })` by hand from a handler if you want to signal a throttle without going through the instrumented client — it fails the job the same way — but with the client you don't need to.

### How gating works

Rate-limit state is kept in Postgres (table `pgboss.rate_limit`, created automatically on worker startup), not in memory, so it is shared across all worker instances/processes reading the same database — one worker's usage counts against the shared budget seen by all of them.

On every poll, the worker asks the limiter which keys are currently blocked and excludes jobs carrying those keys from the fetch. Concretely:

- A job that opts in is enqueued with its `rateLimited` key as a pg-boss group id.
- When a key is exhausted (or backed off), jobs in that group simply stay in the `created` state — they are not fetched, not failed, not retried; they just wait.
- Jobs in **other** groups on the same queue are unaffected and keep being fetched and processed normally.
- Once the window rolls over (`static`), the reported `resetAt`/`remaining` allow it again (`headers`), or the backoff elapses (`failure`), the key stops being blocked and its jobs resume flowing on the next poll.

### Overshoot caveat

Gating happens once per poll and is binary (a key is either fetchable or not for that whole poll) — it is not a token bucket consulted per-job-per-worker. That means a single poll can fetch up to `batchSize` jobs for a not-yet-blocked key, and this can happen concurrently across all workers polling that queue, so a burst can overshoot the configured limit by up to `batchSize × workers` before the key is observed as blocked on the next poll. For hot queues where staying close to the limit matters, lower `batchSize` to reduce the size of a possible overshoot.

### Producers vs. workers

The `PgbossRateLimiter` is provided automatically by `PgBossWorkerModule` (configured from its `rateLimits` option) — worker apps get rate limiting for free, nothing extra to import. It is not pulled in by `PgBossSchedulerModule`; producer-only apps that just schedule jobs don't need it and don't declare `rateLimits` — the `rateLimited` key is read from the job at schedule time to tag its group, which requires no module or config on the producer side. A key that no worker declares in `rateLimits` is simply never gated (jobs flow normally).
