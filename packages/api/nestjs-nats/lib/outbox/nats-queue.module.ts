import { DynamicModule, Module, Provider } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { PublishNatsEventJobHandler } from './publish-nats-event/publish-nats-event.handler.js'
import { PublishNatsEventJob } from './publish-nats-event/publish-nats-event.job.js'
import { PublishNatsStreamEventJobHandler } from './publish-nats-stream-event/publish-nats-stream-event.handler.js'
import { PublishNatsStreamEventJob } from './publish-nats-stream-event/publish-nats-stream-event.job.js'
import type { NatsQueueModuleAsyncOptions, NatsQueueModuleOptions } from './nats-queue.module-options.js'
import { Bouncer, PgBossJob, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'
import { NatsOutboxQueueBouncer } from '#src/outbox/nats-outbox.queue.bouncer.js'

const NATS_QUEUE_MODULE_OPTIONS = 'wisemen.nats_queue_module_options'
const NATS_QUEUE_REGISTRATION = 'wisemen.nats_queue_registration'

@Module({})
export class NatsQueueModule {
  /**
   * This method is only intended to be called once per app.
   * Calling multiple times will result in the last queue name winning.
   *
   * Prefer a dedicated queue name for this module. A queue bouncer is
   * configured for the NATS jobs on this queue, so sharing it with unrelated
   * jobs can cause them to be throttled by the same bouncer policy.
   */
  static forRoot (options: NatsQueueModuleOptions): DynamicModule {
    return this.forRootAsync({
      useFactory: () => options
    })
  }

  /**
   * This method is only intended to be called once per app.
   * Calling multiple times will result in the last queue name winning.
   *
   * Prefer a dedicated queue name for this module. A queue bouncer is
   * configured for the NATS jobs on this queue, so sharing it with unrelated
   * jobs can cause them to be throttled by the same bouncer policy.
   */
  static forRootAsync (options: NatsQueueModuleAsyncOptions): DynamicModule {
    return {
      module: NatsQueueModule,
      imports: options.imports ?? [],
      providers: [
        this.createOptionsProvider(options),
        this.createNatsClientProvider(),
        this.createQueueRegistrationProvider(),
        NatsOutboxQueueBouncer,
        PublishNatsEventJobHandler,
        PublishNatsStreamEventJobHandler
      ]
    }
  }

  private static createOptionsProvider (options: NatsQueueModuleAsyncOptions): Provider {
    return {
      provide: NATS_QUEUE_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? []
    }
  }

  private static createNatsClientProvider (): Provider {
    return {
      provide: NatsClient,
      useFactory: (options: NatsQueueModuleOptions) => options.natsClient,
      inject: [NATS_QUEUE_MODULE_OPTIONS]
    }
  }

  private static createQueueRegistrationProvider (): Provider {
    return {
      provide: NATS_QUEUE_REGISTRATION,
      useFactory: (options: NatsQueueModuleOptions): true => {
        PgBossJob(options.queueName)(PublishNatsEventJob)
        PgBossJob(options.queueName)(PublishNatsStreamEventJob)
        PgBossJobHandler(PublishNatsEventJob)(PublishNatsEventJobHandler)
        PgBossJobHandler(PublishNatsStreamEventJob)(PublishNatsStreamEventJobHandler)
        Bouncer(options.queueName)(NatsOutboxQueueBouncer)

        return true
      },
      inject: [NATS_QUEUE_MODULE_OPTIONS]
    }
  }
}
