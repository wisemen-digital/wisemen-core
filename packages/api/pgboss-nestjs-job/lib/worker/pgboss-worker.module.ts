import assert from 'assert'
import { DynamicModule, Module } from '@nestjs/common'
import { JobModule } from '../jobs/job.module.js'
import { PgBossClientModule } from '../client/pgboss-client.module.js'
import { PgBossWorker } from './pgboss-worker.js'
import { ConfigurableModuleClass, PgbossWorkerModuleAsyncOptions, PgbossWorkerModuleOptions } from './pgboss-worker.module-definition.js'

@Module({
  imports: [JobModule],
  providers: [PgBossWorker]
})
export class PgBossWorkerModule extends ConfigurableModuleClass {
  static override forRoot (options: PgbossWorkerModuleOptions): DynamicModule {
    const module = super.forRoot(options)
    const imports = [...module.imports ?? []]

    const clientModule = PgBossClientModule.forRoot({
      pgBossOptions: options.pgBossOptions,
      onClientError: options.onClientError
    })

    imports.push(clientModule)

    if (options.bouncerModule) {
      imports.push(options.bouncerModule)
    }

    return { ...module, imports }
  }

  static override forRootAsync (options: PgbossWorkerModuleAsyncOptions): DynamicModule {
    const module = super.forRootAsync(options)
    const imports = module.imports ?? []

    const clientModule = PgBossClientModule.forRootAsync({
      inject: options.inject,
      useFactory: async (...args: unknown[]) => {
        assert(options.useFactory !== undefined, 'PgBossWorkerModule: missing useFactory in options')

        const clientModuleOptions = await options.useFactory(...args)

        return {
          pgBossOptions: clientModuleOptions.pgBossOptions,
          onClientError: clientModuleOptions.onClientError
        }
      }
    })

    imports.push(clientModule)

    if (options.bouncerModule) {
      imports.push(options.bouncerModule)
    }

    return { ...module, imports }
  }
}
