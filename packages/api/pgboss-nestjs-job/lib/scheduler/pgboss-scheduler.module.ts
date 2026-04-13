import assert from 'assert'
import { DynamicModule, Module } from '@nestjs/common'
import { PgBossClientModule } from '../client/pgboss-client.module.js'
import { PgBossScheduler } from './pgboss-scheduler.js'
import { ASYNC_OPTIONS_TYPE, ConfigurableModuleClass, OPTIONS_TYPE } from './pgboss-scheduler.module-definition.js'

@Module({
  providers: [PgBossScheduler],
  exports: [PgBossScheduler]
})
export class PgBossSchedulerModule extends ConfigurableModuleClass {
  static override forRoot (options: typeof OPTIONS_TYPE): DynamicModule {
    const module = super.forRoot(options)
    const imports = [...module.imports ?? []]

    const clientModule = PgBossClientModule.forRoot({
      pgBossOptions: options.pgBossOptions,
      onClientError: options.onClientError
    })

    imports.push(clientModule)

    return { ...module, imports }
  }

  static override forRootAsync (options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const module = super.forRootAsync(options)
    const moduleImports = module.imports ?? []

    const clientModule = PgBossClientModule.forRootAsync({
      inject: options.inject,
      useFactory: async (...args: unknown[]) => {
        assert(options.useFactory !== undefined, 'PgBossSchedulerModule: missing useFactory in options')

        const clientOptions = await options.useFactory(...args)

        return {
          pgBossOptions: clientOptions.pgBossOptions,
          onClientError: clientOptions.onClientError
        }
      }
    })

    moduleImports.push(clientModule)

    return module
  }
}
