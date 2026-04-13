export interface NatsClientModuleOptions {
  /** The NATS server endpoint, e.g. `nats://localhost:4222` */
  endpoint: string
  /** Optional base64-encoded NATS credentials (NKey seed + creds) */
  nkey?: string
}

export interface NatsClientModuleAsyncOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => NatsClientModuleOptions | Promise<NatsClientModuleOptions>
}
