import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'

/**
 * Synchronous configuration for `NatsPublisherModule.forRoot(...)`.
 */
export interface NatsPublisherModuleOptions {
  /**
   * Scheduler used to enqueue NATS publish jobs.
   */
  scheduler: PgBossScheduler

  /**
   * The pgboss queue name on which the async publish jobs will be queued
   */
  queueName: string
}

/**
 * Async configuration for `NatsPublisherModule.forRootAsync(...)`.
 */
export interface NatsPublisherModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional modules that should be imported before resolving the factory.
   */
  imports?: ModuleMetadata['imports']
  /**
   * Factory that resolves the scheduler from config, test setup, or other
   * application wiring.
   */
  useFactory: (...args: unknown[]) => Promise<NatsPublisherModuleOptions> | NatsPublisherModuleOptions
  /** Dependencies injected into `useFactory`. */
  inject?: FactoryProvider['inject']
}
