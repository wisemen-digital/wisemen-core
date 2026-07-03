import { type DynamicModule, Module } from '@nestjs/common'
import { OneSignalClient } from './one-signal.client.js'
import { ONE_SIGNAL_CLIENT_OPTIONS_TOKEN } from './tokens.js'
import { SendPushNotificationUseCase } from './use-cases/send-push-notification/send-push-notification.use-case.js'
import type { OneSignalClientModuleAsyncOptions } from './one-signal.client.options.js'

export type { OneSignalClientModuleOptions, OneSignalClientModuleAsyncOptions } from './one-signal.client.options.js'

@Module({})
export class OneSignalClientModule {
  static forRootAsync (options: OneSignalClientModuleAsyncOptions): DynamicModule {
    return {
      module: OneSignalClientModule,
      providers: [
        {
          provide: ONE_SIGNAL_CLIENT_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject ?? []
        },
        OneSignalClient,
        SendPushNotificationUseCase
      ],
      exports: [OneSignalClient, SendPushNotificationUseCase]
    }
  }
}
