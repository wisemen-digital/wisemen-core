import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import type { PermifyClient } from '../permify.client.js'

/**
 * Configuration resolved by `PermifyQueueModule.forRootAsync(...)`.
 */
export interface PermifyQueueModuleOptions {
  /** The configured Permify client used by the queue job handlers. */
  permifyClient: PermifyClient
}

/**
 * Async configuration for `PermifyQueueModule.forRootAsync(...)`.
 *
 * Import the module that provides `PermifyClient`, inject that client into the
 * factory, and return it as `permifyClient`.
 */
export interface PermifyQueueModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<PermifyQueueModuleOptions> | PermifyQueueModuleOptions
  inject?: FactoryProvider['inject']
}
