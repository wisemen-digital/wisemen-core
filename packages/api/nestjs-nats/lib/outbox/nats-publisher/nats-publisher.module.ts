import { DynamicModule, Module, Provider } from '@nestjs/common'
import { NATS_PUBLISHER_SCHEDULER, NatsPublisher } from './nats-publisher.js'
import type { NatsPublisherModuleAsyncOptions, NatsPublisherModuleOptions } from './nats-publisher.module-options.js'


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
        this.createSchedulerProvider(options),
        NatsPublisher
      ],
      exports: [NatsPublisher]
    }
  }

  private static createSchedulerProvider (options: NatsPublisherModuleAsyncOptions): Provider {
    return {
      provide: NATS_PUBLISHER_SCHEDULER,
      useFactory: async (...args: unknown[]) => {
        const  resolvedOptions = await options.useFactory(...args)
        return resolvedOptions.scheduler
      },
      inject: options.inject
    }
  }
}
