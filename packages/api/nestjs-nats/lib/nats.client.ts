import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { captureException } from '@wisemen/opentelemetry'
import { type NatsConnection, type SubscriptionOptions, type Payload, connect, type Subscription, headers } from '@nats-io/transport-node'
import { propagation, context, type Context } from '@opentelemetry/api'
import type { TraceContextCarrier } from '@wisemen/opentelemetry'
import { NatsUnavailableError } from './errors/nats-unavailable.error.js'
import { NATS_CLIENT_OPTIONS_TOKEN } from './tokens.js'
import type { NatsClientModuleOptions } from './nats.client.options.js'

interface SubscribeOptions {
  queueName: string
}

@Injectable()
export class NatsClient implements OnModuleInit, OnModuleDestroy {
  private static DEFAULT_RECONNECT_DELAY = 5_000 // ms
  private _client?: NatsConnection
  private connected = false
  private lastConnectionAttempt: Date | null = null

  constructor (
    @Inject(NATS_CLIENT_OPTIONS_TOKEN) private options: NatsClientModuleOptions
  ) { }

  async client (): Promise<NatsConnection> {
    if (this._client === undefined) {
      const connected = await this.connect()
      if (!connected || !this.hasUsableClient()) {
        throw new NatsUnavailableError('The NATS client is not configured')
      }
    }

    return this._client!
  }

  async onModuleInit (): Promise<void> {
    await this.connect()
  }

  async onModuleDestroy (): Promise<void> {
    if (this._client !== undefined) {
      await this._client.drain()
    }
  }

  async subscribe (subject: string, options?: SubscribeOptions): Promise<Subscription> {
    const opts: SubscriptionOptions = {}

    opts.queue = options?.queueName

    return (await this.client()).subscribe(subject, opts)
  }

  async publish (subject: string, message: Payload | undefined): Promise<void> {
    const natsHeaders = headers()
    const currentContext: Context = context.active()
    const traceContext: TraceContextCarrier = {}

    propagation.inject(currentContext, traceContext)

    if (traceContext.traceparent != null) {
      natsHeaders.set(
        'traceparent' satisfies keyof TraceContextCarrier,
        traceContext.traceparent
      )
    }

    (await this.client()).publish(subject, message, { headers: natsHeaders })
  }

  isConnected (): boolean {
    return this.hasUsableClient() && this.connected
  }

  /** 
   * Attempts to create a connection to the server.
   * When this client has already connected to the server before, this method does not attempt
   * to create a new connection, instead it returns false and relies on the auto reconnect 
   * mechanisms of @nats-io/transport-node
   */
  async reconnect (): Promise<boolean> {
    if (this._client === undefined) {
      return this.connect()
    } else {
      return false
    }
  }

  async ping (): Promise<boolean> {
    try {
      await (await this.client()).flush()
      return true
    } catch (error) {
      captureException(error)
      return false
    }
  }

  private async connect (): Promise<boolean> {
    const reconnectDelay = this.options.client.reconnectTimeWait ?? NatsClient.DEFAULT_RECONNECT_DELAY
    const isReconnectDelayActive = this.lastConnectionAttempt != null
      && Date.now() - this.lastConnectionAttempt.getTime() < reconnectDelay

    if (isReconnectDelayActive) {
      return false
    }

    try {
      this.lastConnectionAttempt = new Date()
      this._client = await connect(this.options.client)
      this.connected = true
      this.monitorConnection(this._client)

      return true
    } catch (error) {
      this.connected = false
      captureException(error)
      await this.options.onConnectError?.(error)
      return false
    }
  }

  private hasUsableClient (): boolean {
    return this._client !== undefined
      && !this._client.isClosed()
      && !this._client.isDraining()
  }

  private monitorConnection (client: NatsConnection): void {
    void this.watchConnectionStatus(client)
    void client.closed().then((error) => {
      this.connected = false

      if (error != null) {
        captureException(error)
      }
    })
  }

  private async watchConnectionStatus (client: NatsConnection): Promise<void> {
    try {
      for await (const status of client.status()) {
        switch (status.type) {
          case 'disconnect':
          case 'reconnecting':
          case 'staleConnection':
          case 'close':
            this.connected = false
            break
          case 'reconnect':
            this.connected = true
            break
        }
      }
    } catch (error) {
      captureException(error)
    }
  }
}
