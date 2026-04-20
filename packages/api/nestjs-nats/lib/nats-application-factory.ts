import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ClassConstructor } from 'class-transformer'
import { getNatsMessageHandlerConfig, isNatsMessageHandler } from './message-handler/on-nats-message.decorator.js'
import { NatsApplication } from './nats-application.js'
import { getNatsStreamConfig } from './streams/nats-stream.decorator.js'
import { getNatsParameters, type MethodName } from './parameters/nats-parameter.js'
import { getNatsSubscriberHandlerConfig, isNatsSubscriberHandler } from './subscribers/nats-subscriber-handler.decorator.js'
import { getNatsConsumerHandlerConfig, isNatsConsumerHandler } from './consumers/nats-consumer-handler.decorator.js'
import { isNatsServiceEndpoint, getNatsServiceEndpointConfig } from './services/nats-service-endpoint.decorator.js'
import { NATS_STREAMS_TOKEN } from './tokens.js'
import type { NestjsProvider } from './providers/providers-explorer.js'
import { ProvidersExplorer } from './providers/providers-explorer.js'

@Injectable()
export class NatsApplicationFactory {
  constructor (
    private providerExplorer: ProvidersExplorer,
    private config: ConfigService,
    @Inject(NATS_STREAMS_TOKEN) private streams?: ClassConstructor<unknown>[]
  ) {}

  async createApp (): Promise<NatsApplication> {
    const app = new NatsApplication()

    for (const stream of this.streams ?? []) {
      const options = getNatsStreamConfig(stream, this.config)

      await app.establishStream(options)
    }

    for (const provider of this.providerExplorer.providers) {
      await this.registerProvider(app, provider)
    }

    return app
  }

  private async registerProvider (app: NatsApplication, provider: NestjsProvider): Promise<void> {
    if (!isNatsMessageHandler(provider.providerClass)) {
      return
    }

    if (isNatsSubscriberHandler(provider.providerClass)) {
      await this.addSubscriberHandler(app, provider)
    }

    if (isNatsConsumerHandler(provider.providerClass)) {
      await this.addConsumerHandler(app, provider)
    }

    if (isNatsServiceEndpoint(provider.providerClass)) {
      await this.addServiceEndpoint(app, provider)
    }
  }

  async addSubscriberHandler (app: NatsApplication, provider: NestjsProvider): Promise<void> {
    const handlers = getNatsMessageHandlerConfig(provider.providerClass)
    const subscriber = getNatsSubscriberHandlerConfig(provider.providerClass, this.config)

    for (const handler of handlers) {
      const parameters = getNatsParameters(provider.providerClass, handler.methodName)
      const callback = this.bind(provider.providerInstance, handler.methodName)

      await app.addSubscriberHandler({ parameters, subscriber, callback, event: handler.event })
    }
  }

  async addConsumerHandler (app: NatsApplication, provider: NestjsProvider): Promise<void> {
    const handlers = getNatsMessageHandlerConfig(provider.providerClass)
    const consumer = getNatsConsumerHandlerConfig(provider.providerClass, this.config)

    for (const handler of handlers) {
      const parameters = getNatsParameters(provider.providerClass, handler.methodName)
      const callback = this.bind(provider.providerInstance, handler.methodName)

      await app.addConsumerHandler({ parameters, consumer, callback, event: handler.event })
    }
  }

  async addServiceEndpoint (app: NatsApplication, provider: NestjsProvider): Promise<void> {
    const handlers = getNatsMessageHandlerConfig(provider.providerClass)
    const endpoint = getNatsServiceEndpointConfig(provider.providerClass, this.config)

    for (const handler of handlers) {
      const parameters = getNatsParameters(provider.providerClass, handler.methodName)
      const callback = this.bind(provider.providerInstance, handler.methodName)

      await app.addServiceEndpoint({
        name: endpoint.name,
        service: endpoint.service,
        handler: endpoint.handler,
        metadata: endpoint.metadata,
        queue: endpoint.queue,
        subject: endpoint.subject,
        parameters,
        callback,
        event: handler.event
      })
    }
  }

  private bind (instance: object, method: MethodName): (...args: unknown[]) => Promise<unknown> {
    const i = instance as Record<MethodName, (...args: unknown[]) => Promise<unknown>>

    return (i)[method].bind(instance) as (...args: unknown[]) => Promise<unknown>
  }
}
