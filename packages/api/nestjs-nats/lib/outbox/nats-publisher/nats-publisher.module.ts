import { DynamicModule, Module } from '@nestjs/common'
import { PgBossScheduler } from '@wisemen/pgboss-nestjs-job'
import { NatsPublisher } from './nats-publisher.js'
import type { NatsPublisherModuleOptions } from './nats-publisher.module-options.js'

@Module({})
export class NatsPublisherModule {
  static forRoot (options: NatsPublisherModuleOptions): DynamicModule {
    return {
      module: NatsPublisherModule,
      providers: [
        {
          provide: PgBossScheduler,
          useValue: options.scheduler
        },
        NatsPublisher
      ],
      exports: [NatsPublisher]
    }
  }
}
