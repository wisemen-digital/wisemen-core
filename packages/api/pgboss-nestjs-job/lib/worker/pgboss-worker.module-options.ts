import { PgBossClientModuleOptions } from '../client/pgboss-client.module-options.js'

export interface PgbossWorkerQueueOptions {
  queueName: string
  concurrency?: number
  pollInterval?: number
  batchSize?: number
  fetchRefreshThreshold?: number
}

export interface PgBossWorkerModuleOptions extends PgBossClientModuleOptions {
  queues: PgbossWorkerQueueOptions[]
}
