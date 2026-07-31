import { DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from '../nats.client.js'
import { PublishNatsEventJobHandler } from './publish-nats-event/publish-nats-event.handler.js'
import { PublishNatsEventJob } from './publish-nats-event/publish-nats-event.job.js'
import { PublishNatsStreamEventJobHandler } from './publish-nats-stream-event/publish-nats-stream-event.handler.js'
import { PublishNatsStreamEventJob } from './publish-nats-stream-event/publish-nats-stream-event.job.js'
import type { NatsQueueModuleOptions } from './nats-queue.module-options.js'
import { PgBossJob, PgBossJobHandler } from '@wisemen/pgboss-nestjs-job'

@Module({})
export class NatsQueueModule {
  /**
   * This method is only intended to be called once per app.
   * Calling multiple times will result in the last queue name winning.
   */
  static forRoot (options: NatsQueueModuleOptions): DynamicModule {
    PgBossJob(options.queueName)(PublishNatsEventJob)
    PgBossJob(options.queueName)(PublishNatsStreamEventJob)
    PgBossJobHandler(PublishNatsEventJob)(PublishNatsEventJobHandler)
    PgBossJobHandler(PublishNatsStreamEventJob)(PublishNatsStreamEventJobHandler)

    return {
      module: NatsQueueModule,
      providers: [
        {
          provide: NatsClient,
          useValue: options.natsClient
        },
        PublishNatsEventJobHandler,
        PublishNatsStreamEventJobHandler
      ]
    }
  }
}
