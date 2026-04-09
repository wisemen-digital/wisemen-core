import { type DynamicModule, Module, type OnApplicationBootstrap, type OnApplicationShutdown, type Type } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import { NatsApplication } from './nats-application.js'
import { NatsApplicationFactory } from './nats-application-factory.js'
import { DEFAULT_NATS_CLIENT_TOKEN as DEFAULT_NATS_CONNECTION_TOKEN, NATS_STREAMS_TOKEN } from './tokens.js'
import { ProvidersExplorerModule } from './providers/providers-explorer.module.js'

export interface NatsApplicationModuleOptions {
  modules: Type<unknown>[]
  /** Creates/updates the streams at startup */
  streams?: Array<ClassConstructor<unknown>>
  defaultConnection?: ClassConstructor<unknown>
}

@Module({})
export class NatsModule implements OnApplicationBootstrap, OnApplicationShutdown {
  static forRoot (options: NatsApplicationModuleOptions): DynamicModule {
    return {
      module: NatsModule,
      imports: [
        ProvidersExplorerModule,
        ...options.modules
      ],
      providers: [
        { provide: DEFAULT_NATS_CONNECTION_TOKEN, useValue: options.defaultConnection },
        { provide: NATS_STREAMS_TOKEN, useValue: options.streams },
        NatsApplicationFactory
      ]
    }
  }

  private application: NatsApplication

  constructor (private readonly appFactory: NatsApplicationFactory) {}

  async onApplicationBootstrap (): Promise<void> {
    this.application = await this.appFactory.createApp()
    this.application.listen()
  }

  async onApplicationShutdown (): Promise<void> {
    if (this.application !== undefined) {
      await this.application.close()
    }
  }
}
