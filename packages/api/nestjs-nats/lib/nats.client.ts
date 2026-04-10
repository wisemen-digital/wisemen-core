import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { captureException } from '@wisemen/opentelemetry'
import { type KV, Kvm } from '@nats-io/kv'
import {
  type NatsConnection,
  type Authenticator,
  credsAuthenticator,
  type SubscriptionOptions,
  type Payload,
  connect,
  type Subscription,
  headers
} from '@nats-io/transport-node'
import { jetstream } from '@nats-io/jetstream'
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
  private _client?: NatsConnection
  private _cache?: KV

  constructor (
    @Inject(NATS_CLIENT_OPTIONS_TOKEN)
    private readonly options: NatsClientModuleOptions
  ) {}

  public get client (): NatsConnection {
    if (this._client == null) {
      throw new NatsUnavailableError('The NATS client is not configured')
    } else {
      return this._client
    }
  }

  public get cache (): KV {
    if (this._cache == null) {
      throw new NatsUnavailableError('The NATS cache is not configured')
    } else {
      return this._cache
    }
  }

  async onModuleInit (): Promise<void> {
    try {
      this._client = await connect({
        servers: this.options.endpoint,
        authenticator: this.getAuthenticator(),
        timeout: 3000
      })

      const js = jetstream(this.client)

      this._cache = await new Kvm(js).create('cache')
    } catch (error) {
      captureException(error)
    }
  }

  async onModuleDestroy (): Promise<void> {
    if (this._client !== undefined) {
      await this._client.drain()
    }
  }

  private getAuthenticator (): Authenticator | undefined {
    if (this.options.nkey == null) {
      return undefined
    } else {
      return credsAuthenticator(new TextEncoder().encode(Buffer.from(this.options.nkey, 'base64').toString()))
    }
  }

  subscribe (subject: string, options?: SubscribeOptions): Subscription {
    const opts: SubscriptionOptions = {}

    opts.queue = options?.queueName

    return this.client.subscribe(subject, opts)
  }

  publish (subject: string, message: Payload | undefined): void {
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

    this.client.publish(subject, message, { headers: natsHeaders })
  }

  async getValue (key: string): Promise<string | null> {
    const result = await this.cache.get(key)

    if (result != null && result.operation === 'PUT') {
      return String(result.value)
    }

    return null
  }

  async putValue (key: string, value: string): Promise<void> {
    await this.cache.put(key, value)
  }

  async deleteValue (key: string): Promise<void> {
    await this.cache.delete(key)
  }
}
