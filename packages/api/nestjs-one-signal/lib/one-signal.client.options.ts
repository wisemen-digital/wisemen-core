// oxlint-disable typescript/no-explicit-any

export interface OneSignalClientModuleOptions {
  /** The OneSignal app id notifications are sent from. */
  appId: string
  /** The OneSignal REST API key used to authenticate requests. */
  apiKey: string
}

export interface OneSignalClientModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => OneSignalClientModuleOptions | Promise<OneSignalClientModuleOptions>
}
