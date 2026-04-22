import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PgBossClient } from '../client/pgboss-client.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { PgBossWorker } from './pgboss-worker.js'
import { MODULE_OPTIONS_TOKEN, PgbossWorkerModuleOptions } from './pgboss-worker.module-definition.js'
import { PgbossBouncerRegistry } from './pgboss-bouncer.registry.js'

@Injectable()
export class PgbossWorkerApp implements OnModuleInit, OnModuleDestroy {
  private workers: PgBossWorker[] = []
  private readonly logger = new Logger('pgboss')

  constructor (
    private client: PgBossClient,
    private bouncerRegistry: PgbossBouncerRegistry,
    private jobRegistry: JobRegistry,
    @Inject(MODULE_OPTIONS_TOKEN) private options: PgbossWorkerModuleOptions
  ) { }

  async onModuleInit (): Promise<void> {
    try {
      for (const queueOptions of this.options.queues) {
        const bouncer = await this.bouncerRegistry.getBouncer(queueOptions.queueName)
        const worker = new PgBossWorker(queueOptions, bouncer, this.client, this.jobRegistry)

        await this.client.createQueue(queueOptions.queueName, { policy: 'stately' })
        worker.start()
        this.workers.push(worker)
        this.logger.log(`${queueOptions.queueName} worker started`)
      }
    } catch (e) {
      await Promise.allSettled(this.workers.map(w => w.stop()))
      throw e
    }
  }

  async onModuleDestroy (): Promise<void> {
    await Promise.allSettled(this.workers.map(w => w.stop()))
  }
}
