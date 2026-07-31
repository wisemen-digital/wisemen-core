import { DynamicModule, Module, Provider } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NatsPublisher } from './nats-publisher.js'
import type { NatsPublisherModuleAsyncOptions, NatsPublisherModuleOptions } from './nats-publisher.module-options.js'

const NATS_PUBLISHER_MODULE_OPTIONS = 'wisemen.nats_publisher_module_options'

@Module({})
export class NatsPublisherModule {
  static forRoot (options: NatsPublisherModuleOptions): DynamicModule {
    return this.forRootAsync({
      useFactory: () => options
    })
  }

  static forRootAsync (options: NatsPublisherModuleAsyncOptions): DynamicModule {
    return {
      module: NatsPublisherModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        this.createSchedulerProvider(),
        NatsPublisher
      ],
      exports: [NatsPublisher]
    }
  }

  private static createOptionsProvider (options: NatsPublisherModuleAsyncOptions): Provider {
    return {
      provide: NATS_PUBLISHER_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static createSchedulerProvider (): Provider {
    return {
      provide: PgBossScheduler,
      useFactory: (options: NatsPublisherModuleOptions) => options.scheduler,
      inject: [NATS_PUBLISHER_MODULE_OPTIONS]
    }
  }
}
