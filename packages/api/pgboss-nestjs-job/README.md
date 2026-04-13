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
