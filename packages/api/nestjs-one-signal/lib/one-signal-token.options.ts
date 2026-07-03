// oxlint-disable typescript/no-explicit-any

export interface OneSignalTokenModuleOptions {
  /** The OneSignal app id the identity tokens are issued for. */
  appId: string
  /** Base64-encoded ES256 private key (PEM) used to sign identity tokens. */
  privateKey: string
  /** Passphrase protecting the private key. */
  passphrase: string
}

export interface OneSignalTokenModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => OneSignalTokenModuleOptions | Promise<OneSignalTokenModuleOptions>
}
