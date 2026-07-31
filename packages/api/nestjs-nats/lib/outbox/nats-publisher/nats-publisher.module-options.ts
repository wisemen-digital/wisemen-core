import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'

/**
 * Synchronous configuration for `NatsPublisherModule.forRoot(...)`.
 */
export interface NatsPublisherModuleOptions {
  /**
   * Scheduler used to enqueue NATS publish jobs.
   */
  scheduler: PgBossScheduler
}
