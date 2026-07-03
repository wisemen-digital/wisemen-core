import { type DynamicModule, Module } from '@nestjs/common'
import { OneSignalClientModule } from './one-signal.client.module.js'
import { OneSignalTokenModule } from './one-signal-token.module.js'
import type { OneSignalModuleAsyncOptions } from './one-signal.options.js'

export type { OneSignalModuleOptions, OneSignalModuleAsyncOptions } from './one-signal.options.js'

@Module({})
export class OneSignalModule {
  static forRootAsync (options: OneSignalModuleAsyncOptions): DynamicModule {
    const tokenModule = OneSignalTokenModule.forRootAsync({
      inject: options.inject,
      useFactory: options.useFactory
    })

    const clientModule = OneSignalClientModule.forRootAsync({
      inject: options.inject,
      useFactory: options.useFactory
    })

    return {
      module: OneSignalModule,
      imports: [tokenModule, clientModule],
      exports: [tokenModule, clientModule]
    }
  }
}
