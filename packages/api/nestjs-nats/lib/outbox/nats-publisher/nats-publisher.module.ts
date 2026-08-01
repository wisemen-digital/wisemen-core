import { DynamicModule, Module, Provider } from '@nestjs/common'
import { NATS_PUBLISHER_SCHEDULER, NatsPublisher } from './nats-publisher.js'
import type { NatsPublisherModuleAsyncOptions, NatsPublisherModuleOptions } from './nats-publisher.module-options.js'
import { PublishNatsEventJob } from '#src/outbox/publish-nats-event/publish-nats-event.job.js'
import { PublishNatsStreamEventJob } from '#src/outbox/publish-nats-stream-event/publish-nats-stream-event.job.js'
import { PgBossJob } from '@wisemen/pgboss-nestjs-job'

const NATS_PUBLISHER_OPTIONS = 'wisemen.nats-publisher-options'

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
        {
          provide: NATS_PUBLISHER_OPTIONS,
          useFactory: async (...args: unknown[]) => {
            const resolvedOptions = await options.useFactory(...args)
            PgBossJob(resolvedOptions.queueName)(PublishNatsEventJob)
            PgBossJob(resolvedOptions.queueName)(PublishNatsStreamEventJob)
            return resolvedOptions
          }, 
          inject: options.inject
        },
        {
          provide: NATS_PUBLISHER_SCHEDULER,
          inject: [NATS_PUBLISHER_OPTIONS],
          useFactory: (options: NatsPublisherModuleOptions) => options.scheduler
        },
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
