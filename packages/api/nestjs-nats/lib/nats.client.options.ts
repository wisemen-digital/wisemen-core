// oxlint-disable typescript/no-explicit-any
import { NodeConnectionOptions } from "@nats-io/transport-node"

export type NatsClientModuleOptions = {
  /** Optional base64-encoded NATS credentials (NKey seed + creds) */
  nkey?: string
  /** Options passed directly to the underlying NATS client */
  client: Omit<NodeConnectionOptions, 'authenticator'>
} | {
  /** Options passed directly to the underlying NATS client */
  client: NodeConnectionOptions
}

export interface NatsClientModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => NatsClientModuleOptions | Promise<NatsClientModuleOptions>
}
