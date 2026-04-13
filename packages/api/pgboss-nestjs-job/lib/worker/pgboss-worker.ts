import { Inject, Injectable, OnModuleDestroy, OnModuleInit, Optional } from '@nestjs/common'
import { captureError } from 'rxjs/internal/util/errorContext'
import { PgBossClient } from '../client/pgboss-client.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { PgBossWorkerThread } from './pgboss-worker.thread.js'
import { AllowBouncer, QueueBouncer } from './queue-bouncer.js'
import { MODULE_OPTIONS_TOKEN } from './pgboss-worker.module-definition.js'
import { PgBossWorkerModuleOptions } from './pgboss-worker.module-options.js'
import { RawPgBossJob, RawPgBossJobData } from './pgboss-worker.constants.js'

@Injectable()
export class PgBossWorker implements OnModuleInit, OnModuleDestroy {
  private queueName: string
  private jobs: RawPgBossJob[] = []
  private threads: Array<Promise<void>> = []
  private jobFetchingPromise: Promise<void> | null = null
  private working = false
  private concurrency: number
  private pollInterval: number
  private batchSize: number
  private fetchRefreshThreshold: number
  private bouncer: QueueBouncer

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) config: PgBossWorkerModuleOptions,
    @Optional() @Inject(QueueBouncer) bouncer: QueueBouncer | undefined,
    private client: PgBossClient,
    private jobRegistry: JobRegistry
  ) {
    this.queueName = config.queueName
    this.concurrency = config?.concurrency ?? 1
    this.pollInterval = config?.pollInterval ?? 2000
    this.batchSize = config?.batchSize ?? this.concurrency
    this.fetchRefreshThreshold = config?.fetchRefreshThreshold ?? 0
    this.bouncer = bouncer ?? new AllowBouncer()
  }

  onModuleInit (): void {
    if (this.working) {
      return
    }

    this.working = true

    const jobGenerator = this.createJobGenerator()

    this.startWorkerThreads(jobGenerator)
  }

  async onModuleDestroy (): Promise<void> {
    await this.stop()
  }

  private startWorkerThreads (jobGenerator: AsyncGenerator<RawPgBossJob, void, unknown>) {
    for (let i = 0; i < this.concurrency; i++) {
      const thread = new PgBossWorkerThread(jobGenerator, this.client, this.jobRegistry)

      this.threads.push(thread.run())
    }
  }

  private async* createJobGenerator (): AsyncGenerator<RawPgBossJob, void, unknown> {
    while (this.working || this.jobs.length > 0) {
      const job = this.jobs.shift()

      if (job != null) {
        yield job
      } else {
        await this.fetchJobs()
      }

      if (this.jobs.length < this.fetchRefreshThreshold) {
        void this.fetchJobs().catch(captureError)
      }
    }
  }

  private async fetchJobs (): Promise<void> {
    if (!this.working) {
      return
    }

    if (!await this.bouncer.canProceed()) {
      await new Promise(resolve => setTimeout(resolve, this.pollInterval))

      return
    }

    // do not await between this if when null and the assignment of the jobFetchingPromise
    // to avoid multiple fetches in parallel
    if (this.jobFetchingPromise != null) {
      await this.jobFetchingPromise

      return
    }

    this.jobFetchingPromise = new Promise((resolve, reject) => {
      void this.client.fetch<RawPgBossJobData>(
        this.queueName,
        { batchSize: this.batchSize }
      )
        .then(async (jobs) => {
          if (jobs == null || jobs.length === 0) {
            await new Promise(resolve => setTimeout(resolve, this.pollInterval))
          } else {
            this.jobs.push(...jobs)
          }

          resolve()
        })
        .catch((e) => {
          reject(e as Error)
        })
    })

    await this.jobFetchingPromise

    this.jobFetchingPromise = null
  }

  public async stop (): Promise<void> {
    this.working = false

    await Promise.allSettled(this.threads)
  }
}
