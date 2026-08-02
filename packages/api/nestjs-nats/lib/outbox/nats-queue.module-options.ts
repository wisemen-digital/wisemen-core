import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'

/**
 * Synchronous configuration for `NatsQueueModule.forRoot(...)`.
 */
export interface NatsQueueModuleOptions {
  /**
   * The pgboss queue name on which the NATS publish job will be declared.
   */
  queueName: string
  /**
   * Client used by the job handler to publish messages.
   */
  natsClient: NatsClient
}

/**
 * Async configuration for `NatsQueueModule.forRootAsync(...)`.
 */
export interface NatsQueueModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Optional modules that should be imported before resolving the factory.
   */
  imports?: ModuleMetadata['imports']
  /**
   * Factory that resolves the queue name and client from config, test setup, or
   * other application wiring.
   */
  useFactory: (...args: unknown[]) => Promise<NatsQueueModuleOptions> | NatsQueueModuleOptions
  /** Dependencies injected into `useFactory`. */
  inject?: FactoryProvider['inject']
}
