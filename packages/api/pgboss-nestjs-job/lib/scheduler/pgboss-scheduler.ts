import { randomUUID } from 'crypto'
import { AsyncLocalStorage } from 'async_hooks'
import { Injectable } from '@nestjs/common'
import { ConnectionOptions } from 'pg-boss'
import { EntityManager } from 'typeorm'
import { createTransactionManagerProxy, InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { Reflector } from '@nestjs/core'
import { Trace } from '@wisemen/opentelemetry'
import { propagation, context } from '@opentelemetry/api'
import { PgBossClient } from '../client/pgboss-client.js'
import { BaseJob } from '../jobs/base-job.js'
import { PGBOSS_JOB_HANDLER, PGBOSS_QUEUE_NAME } from '../jobs/job.decorator.js'
import { SerializedJob } from '../jobs/serialized-job.js'
import { TraceContextCarrier } from '../jobs/trace-context-carrier.js'

@Injectable()
export class PgBossScheduler {
  private readonly manager: EntityManager
  private readonly jobStorage: AsyncLocalStorage<SerializedJob<BaseJob>[]>

  constructor (
    private boss: PgBossClient,
    private reflector: Reflector,
    @InjectEntityManager() entityManager: EntityManager
  ) {
    this.manager = createTransactionManagerProxy(entityManager)
    this.jobStorage = new AsyncLocalStorage()
  }

  async scheduleJob<T extends BaseJob>(job: T): Promise<void> {
    await this.scheduleJobs([job])
  }

  @Trace()
  async scheduleJobs<T extends BaseJob>(jobs: T[]): Promise<void> {
    const outputTraceContext: TraceContextCarrier = {}

    propagation.inject(context.active(), outputTraceContext)

    const serializedJobs = jobs.map(job => this.serializeJob(job, outputTraceContext))

    const storedJobs = this.jobStorage.getStore()

    if (storedJobs !== undefined) {
      storedJobs.push(...serializedJobs)

      return
    }

    await this.insertJobs(serializedJobs)
  }

  /**
   * Captures all scheduled jobs through `scheduleJob` and `scheduleJobs` invocations.
   * All captured jobs are inserted in query after the callback ends.
   */
  async runAndCaptureJobs (callback: () => void | Promise<void>): Promise<void> {
    const existingJobs = this.jobStorage.getStore()

    if (existingJobs !== undefined) {
      await this.jobStorage.run(existingJobs, callback)

      return
    }

    const capturedJobs: SerializedJob<BaseJob>[] = []

    await this.jobStorage.run(capturedJobs, callback)

    if (capturedJobs.length > 0) {
      await this.insertJobs(capturedJobs)
    }
  }

  private serializeJob<T extends BaseJob>(job: T, context: TraceContextCarrier): SerializedJob<T> {
    const queue = this.reflector.get<string>(PGBOSS_QUEUE_NAME, job.constructor)
    const className = this.reflector.get<string>(PGBOSS_JOB_HANDLER, job.constructor)

    return {
      name: queue,
      data: {
        className,
        classData: job.data,
        traceContext: context ?? {}
      },
      priority: job.options?.priority,
      retryLimit: job.options?.retryLimit,
      retryDelay: job.options?.retryDelay,
      retryBackoff: job.options?.retryBackoff,
      startAfter: job.options?.startAfter,
      singletonKey: job.options?.singletonKey ?? randomUUID(),
      singletonSeconds: job.options?.singletonSeconds,
      expireInSeconds: job.options?.expireInSeconds,
      deleteAfterSeconds: job.options?.deleteAfterSeconds,
      retentionSeconds: job.options?.retentionSeconds
    }
  }

  private async insertJobs <T extends BaseJob> (jobs: SerializedJob<T>[]): Promise<void> {
    if (jobs.length === 0) {
      return
    }

    const manager = this.manager

    const options: ConnectionOptions = {
      db: {
        async executeSql (text, values) {
          const result = await manager.query<object[]>(text, values)

          return {
            rows: result,
            rowCount: result.length
          }
        }
      }
    }

    const queueNames = Array.from(new Set(jobs.map(job => job.name)))

    if (queueNames.length > 1) {
      throw new Error('All jobs must have the same queue name')
    }

    await this.boss.insert(queueNames[0], jobs, options)
  }
}
