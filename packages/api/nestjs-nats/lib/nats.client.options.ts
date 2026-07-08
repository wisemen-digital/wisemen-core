// oxlint-disable typescript/no-explicit-any
import { NodeConnectionOptions } from "@nats-io/transport-node"

export type NatsClientModuleOptions = {
  /** Options passed directly to the underlying NATS client */
  client: NodeConnectionOptions
  /**
   * Optionally pass an error handler that gets called whenever the initial connection
   * setup to the server fails. This callback does not get called whenever the connection
   * is lost after an initial successful connection. 
   * 
   * `captureException` is already called by default before this callback is executed.
   */
  onConnectError?: (err: Error) => void | Promise<void>
}

export interface NatsClientModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => NatsClientModuleOptions | Promise<NatsClientModuleOptions>
}
