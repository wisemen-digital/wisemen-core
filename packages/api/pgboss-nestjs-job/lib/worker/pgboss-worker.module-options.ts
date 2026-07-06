import { PgBossClientModuleOptions } from '../client/pgboss-client.module-options.js'
import { RateLimitConfigMap } from '../rate-limit/rate-limit-config.js'

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

/**
 * Central rate-limit declarations, keyed by rate-limit key. Jobs opt in with
 * `super(data, { rateLimited: key })`. Passed directly to `forRoot`/`forRootAsync`
 * (not returned from `useFactory`), so it is deliberately NOT part of
 * `PgBossWorkerModuleOptions` — that keeps it out of the async factory's return
 * type, where it would be silently ignored.
 */
export interface PgBossWorkerRateLimitOptions {
  rateLimits?: RateLimitConfigMap
}
