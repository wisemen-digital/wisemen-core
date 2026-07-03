// oxlint-disable typescript/no-explicit-any

import type { OneSignalClientModuleOptions } from './one-signal.client.options.js'
import type { OneSignalTokenModuleOptions } from './one-signal-token.options.js'

export interface OneSignalModuleOptions
  extends OneSignalTokenModuleOptions, OneSignalClientModuleOptions {}

export interface OneSignalModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => OneSignalModuleOptions | Promise<OneSignalModuleOptions>
}
