import { Type } from '@nestjs/common'
import { PgBossClientModuleOptions } from '../client/pgboss-client.module-options.js'

export interface PgBossWorkerModuleOptions extends PgBossClientModuleOptions {
  queueName: string
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
  /**
     * The bouncer can prevent the worker from polling for jobs.
     * A bouncer is provided as a nestjs module with a provider for QueueBouncer.
     * This provider needs to be exported as well.
     *
     * When no bouncer is needed, or the it is misconfigured, the worker will default
     * to an allow bouncer (i.e. the bouncer never prevents the worker from polling for jobs).
     */
  bouncerModule?: Type<unknown>
}
