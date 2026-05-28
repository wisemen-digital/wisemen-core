---
name: getting-started
description: >
  Set up PgBossWorkerModule and PgBossSchedulerModule, define jobs by extending BaseJob
  with @PgBossJob, create handlers with JobHandler and @PgBossJobHandler, and schedule
  jobs with PgBossScheduler.
type: lifecycle
library: pgboss-nestjs-job
exports:
  - PgBossWorkerModule
  - PgBossSchedulerModule
  - PgBossScheduler
  - BaseJob
  - JobHandler
  - PgBossJob
  - PgBossJobHandler
---

# @wisemen/pgboss-nestjs-job — Getting Started

Background job processing backed by PostgreSQL via pg-boss, with NestJS module integration, typed job definitions, and OpenTelemetry tracing.

## When to Use

- Running background tasks (email sending, report generation, data processing)
- Scheduling delayed or recurring work backed by PostgreSQL
- Processing jobs with configurable concurrency, retries, and backoff

**Use instead:** In-process `setTimeout`/`setInterval` only for non-critical, ephemeral tasks that don't need persistence or retry.

## Import

```ts
import {
  BaseJob, JobHandler, PgBossJob, PgBossJobHandler,
  PgBossWorkerModule, PgBossSchedulerModule, PgBossScheduler,
} from '@wisemen/pgboss-nestjs-job'
import type { BaseJobData } from '@wisemen/pgboss-nestjs-job'
```

## Quick Start

### 1. Define a job

```ts
import { BaseJob, PgBossJob } from '@wisemen/pgboss-nestjs-job'
import type { BaseJobData } from '@wisemen/pgboss-nestjs-job'

interface NotificationJobData extends BaseJobData {
  userId: string
  message: string
}

@PgBossJob('notifications')
export class NotificationJob extends BaseJob<NotificationJobData> {
  constructor(userId: string, message: string) {
    super({ userId, message }, { retryLimit: 3 })
  }
}
```

The `@PgBossJob` decorator registers the queue name. `BaseJob` accepts typed data and optional pg-boss job options (retryLimit, priority, startAfter, singletonKey, etc.).

### 2. Create a handler

```ts
import { Injectable } from '@nestjs/common'
import { JobHandler, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { NotificationJob } from './notification.job.js'

@PgBossJobHandler(NotificationJob)
@Injectable()
export class NotificationJobHandler extends JobHandler<NotificationJob> {
  constructor(private readonly emailService: EmailService) {
    super()
  }

  async run(data: NotificationJob['data']): Promise<void> {
    await this.emailService.send(data.userId, data.message)
  }
}
```

### 3. Register the worker module

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PgBossWorkerModule } from '@wisemen/pgboss-nestjs-job'

@Module({
  imports: [
    PgBossWorkerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pgBossOptions: {
          connectionString: config.getOrThrow('DATABASE_URI'),
        },
        queues: [
          { queueName: 'notifications', concurrency: 4, pollInterval: 2000 },
        ],
      }),
    }),
  ],
  providers: [NotificationJobHandler],
})
export class WorkerModule {}
```

### 4. Schedule jobs

```ts
import { Injectable } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NotificationJob } from './notification.job.js'

@Injectable()
export class UserService {
  constructor(private readonly scheduler: PgBossScheduler) {}

  async createUser(name: string, email: string): Promise<void> {
    // ... create user ...
    await this.scheduler.scheduleJob(new NotificationJob(userId, 'Welcome!'))
  }
}
```

Register `PgBossSchedulerModule.forRootAsync` in the module that injects `PgBossScheduler`.

## Source Files

For full API details, read the source files.

- Job base class: `lib/jobs/base-job.ts`
- Job handler: `lib/jobs/job-handler.ts`
- Decorators: `lib/jobs/job.decorator.ts`
- Worker module: `lib/worker/pgboss-worker.module.ts`, `lib/worker/pgboss-worker.module-options.ts`
- Scheduler: `lib/scheduler/pgboss-scheduler.ts`, `lib/scheduler/pgboss-scheduler.module.ts`

## See Also

- [bouncers](../bouncers/SKILL.md) -- Gate job processing with health checks
