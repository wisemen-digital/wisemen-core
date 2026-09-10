import { DynamicModule, Module, type Provider } from '@nestjs/common'
import { PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { PERMIFY_QUEUE_CLIENT } from './permify-queue.constants.js'
import type { PermifyQueueModuleAsyncOptions, PermifyQueueModuleOptions } from './permify-queue.module-options.js'
import { WritePermifySchemaJobHandler } from './write-permify-schema.job-handler.js'
import { WritePermifySchemaJob } from './write-permify-schema.job.js'
import { WritePermifyTuplesJobHandler } from './write-permify-tuples.job-handler.js'
import { WritePermifyTuplesJob } from './write-permify-tuples.job.js'

const PERMIFY_QUEUE_MODULE_OPTIONS = Symbol('wisemen.permify-queue-module-options')

@Module({})
export class PermifyQueueModule {
  static forRootAsync (options: PermifyQueueModuleAsyncOptions): DynamicModule {
    PgBossJobHandler(WritePermifySchemaJob)(WritePermifySchemaJobHandler)
    PgBossJobHandler(WritePermifyTuplesJob)(WritePermifyTuplesJobHandler)

    return {
      module: PermifyQueueModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        this.createPermifyClientProvider(),
        WritePermifySchemaJobHandler,
        WritePermifyTuplesJobHandler
      ]
    }
  }

  private static createOptionsProvider (options: PermifyQueueModuleAsyncOptions): Provider {
    return {
      provide: PERMIFY_QUEUE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static createPermifyClientProvider (): Provider {
    return {
      provide: PERMIFY_QUEUE_CLIENT,
      useFactory: (options: PermifyQueueModuleOptions) => options.permifyClient,
      inject: [PERMIFY_QUEUE_MODULE_OPTIONS]
    }
  }
}
