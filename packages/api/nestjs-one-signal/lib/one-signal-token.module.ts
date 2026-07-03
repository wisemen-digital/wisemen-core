import { type DynamicModule, Module } from '@nestjs/common'
import { OneSignalTokenService } from './one-signal-token.service.js'
import { ONE_SIGNAL_TOKEN_OPTIONS_TOKEN } from './tokens.js'
import { CreateOneSignalTokenUseCase } from './use-cases/create-one-signal-token/create-one-signal-token.use-case.js'
import type { OneSignalTokenModuleAsyncOptions } from './one-signal-token.options.js'

export type { OneSignalTokenModuleOptions, OneSignalTokenModuleAsyncOptions } from './one-signal-token.options.js'

@Module({})
export class OneSignalTokenModule {
  static forRootAsync (options: OneSignalTokenModuleAsyncOptions): DynamicModule {
    return {
      module: OneSignalTokenModule,
      providers: [
        {
          provide: ONE_SIGNAL_TOKEN_OPTIONS_TOKEN,
          useFactory: options.useFactory,
          inject: options.inject ?? []
        },
        OneSignalTokenService,
        CreateOneSignalTokenUseCase
      ],
      exports: [OneSignalTokenService, CreateOneSignalTokenUseCase]
    }
  }
}
