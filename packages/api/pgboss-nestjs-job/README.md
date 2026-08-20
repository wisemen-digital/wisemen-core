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

#### Rate-limited queues

When a queue's jobs call an external API that is rate limited, give the queue a
**rate-limit bouncer**. It reuses the `QueueBouncer` fetch-gate above — when the
limit is reached the worker simply stops polling, so jobs wait in `created`
instead of failing and burning retries — and keeps its state in Redis (shared
across worker instances) via `@wisemen/nestjs-redis`.

Use one dedicated queue per rate-limited API (the queue name is the limit key).
Register the module once at the app root:

```typescript
PgbossRateLimitModule.forRoot({ url: process.env.REDIS_URL })
// or forRootAsync({ inject: [ConfigService], useFactory: (c) => ({ url: c.getOrThrow('REDIS_URL') }) })
```

Then pick the base class that matches how much you know about the limit and
declare a bouncer for the queue:

```typescript
// STATIC — a known budget (N requests per window)
@Bouncer(QueueName.STRIPE)
export class StripeBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 100, windowSeconds: 60 }
}

// HEADERS — the API reports its own budget via X-RateLimit-* / Retry-After
@Bouncer(QueueName.CUOPT)
export class CuoptBouncer extends HeaderRateLimitBouncer {
  protected readonly options = {} // optional custom header names
}

// FAILURE — nothing is known up front; back off only after a 429 / error
@Bouncer(QueueName.FLAKY)
export class FlakyBouncer extends FailureBackoffBouncer {
  protected readonly options = { backoffSeconds: 30, maxBackoffSeconds: 300 }
}
```

Register the bouncer as a provider in its queue's module (same as any
`QueueBouncer`). The `RedisRateLimitStore` is injected automatically.

**Feed usage back from the transport.** All three modes learn from the actual
HTTP traffic, so wrap the `@wisemen/node-fetch` client that talks to the API with
`useRateLimiting`. A client talks to exactly one rate-limited API, so bind that
queue's bouncer directly — inject it (it is a provider) and pass it in:

```typescript
constructor (private readonly bouncer: StripeBouncer) {
  this.client = createClient({ baseUrl: 'https://api.stripe.com' })
  useRateLimiting(this.client, this.bouncer)
}
```

The interceptor drives the bound bouncer on every call: static counts one request
per call, header mirrors the reported budget, failure backs off on a throttled
response or transport error. A throttled response records the cooldown and throws
`RateLimitError` so the job is retried after the cooldown clears — make sure the
queue has pg-boss retry configured. Because it counts every request through the client, all real API
usage counts against the budget, not only calls made from that queue's jobs.

**Not every API answers with a 429.** Throttling is `429` by default, but SAP and
friends report it as a `503`, a `500`, sometimes even a `400`. Name the statuses
that mean "slow down" in the options and every mode — plus the interceptor that
throws `RateLimitError` — follows:

```typescript
@Bouncer(QueueName.SAP)
export class SapBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 50, windowSeconds: 60, throttleStatuses: [503, 500] }
}
```

`throttleStatuses` **replaces** the default rather than adding to it, so include
`429` explicitly if the API uses both. When a status code alone cannot say it,
override the decision instead — it is the single point every mode consults:

```typescript
@Bouncer(QueueName.SAP)
export class SapBouncer extends StaticRateLimitBouncer {
  protected readonly options = { limit: 50, windowSeconds: 60 }

  override isThrottleResponse (status: number, headers: Record<string, string | undefined>): boolean {
    return status === 400 && headers['x-sap-throttled'] === 'true'
  }
}
```

The response body is deliberately not available here — the interceptor must not
consume the stream. An API that only signals throttling in its payload should
throw `RateLimitError` from its own client code.

**Choose what happens when Redis is down.** Rate limiting **fails open** by
default: if Redis cannot answer, the gate allows and the queue runs at pg-boss
speed. That keeps queues moving, but for an API that bans rather than throttles
(OSRM and friends) flooding it is worse than stalling. Such a queue can opt to
fail closed:

```typescript
@Bouncer(QueueName.OSRM)
export class OsrmBouncer extends StaticRateLimitBouncer {
  protected readonly options = {
    limit: 20,
    windowSeconds: 60,
    onStoreUnavailable: StoreUnavailablePolicy.BLOCK
  }
}
```

The choice is per queue, because it depends on the API: `BLOCK` holds the queue
for as long as Redis is unreachable (jobs stay queued and resume afterwards),
`ALLOW` (default) keeps it running unprotected. Note this is only about Redis
being unreachable — a reachable Redis always enforces the real limit.

The check happens once per poll, so a connection that drops mid-poll can let that
one batch through even under `BLOCK`; the next poll sees Redis is gone and holds.
Exposure is bounded by `batchSize × workers`, the same bound as counter lag below.

Notes:

- **Fail-open by default:** if Redis is unavailable, bouncers allow work through
  rather than wedge the queue — see `onStoreUnavailable` above to invert that.
- Keep rate-limit bouncers **default-scoped** (singleton) — do not mark them
  `TRANSIENT`/`REQUEST`.
- Header mode treats the reset header as **epoch seconds**; APIs that send
  delta-seconds need a custom adapter.
- Enforcement is per-queue (no per-tenant sub-keys), and a poll can fetch a batch
  before the counter updates, so overshoot is bounded by `batchSize × workers` —
  lower `batchSize` on hot queues if needed.
