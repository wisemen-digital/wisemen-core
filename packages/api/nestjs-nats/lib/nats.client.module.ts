import { type DynamicModule, Module } from '@nestjs/common'
import { NatsClient } from './nats.client.js'
import { NATS_CLIENT_OPTIONS_TOKEN } from './tokens.js'
import type { NatsClientModuleAsyncOptions } from './nats.client.options.js'

export type { NatsClientModuleOptions, NatsClientModuleAsyncOptions } from './nats.client.options.js'

@Module({})
export class NatsClientModule {
  static forRootAsync (options: NatsClientModuleAsyncOptions): DynamicModule {
    return {
      module: NatsClientModule,
      providers: [
        {
          provide: NATS_CLIENT_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject ?? []
        },
        NatsClient
      ],
      exports: [NatsClient]
    }
  }
}
