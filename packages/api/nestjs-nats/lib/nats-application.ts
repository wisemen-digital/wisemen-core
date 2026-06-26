import { Logger } from '@nestjs/common'
import type { StreamAPI } from '@nats-io/jetstream'
import type { EndpointOptions, ServiceConfig } from '@nats-io/services'
import type { CloudEventHandlerOptions } from './message-handler/on-nats-message.decorator.js'
import type { NamedConnectionOptions } from './connections/nats-connection.manager.js'
import { NatsConnectionManager } from './connections/nats-connection.manager.js'
import { NatsServiceManager } from './services/nats-service.manager.js'
import type { NatsSubscriberConfig } from './subscribers/nats-subscriber.manager.js'
import { NatsSubscriberManager } from './subscribers/nats-subscriber.manager.js'
import type { NatsConsumerConfig } from './consumers/nats-consumer.manager.js'
import { NatsConsumerManager } from './consumers/nats-consumer.manager.js'
import { NatsMessageHandlerFunction } from './message-handler/nats-message-handler.js'
import { NatsStreamManager } from './streams/nats-stream.manager.js'
import type { NatsParameter, NatsParameterContext } from './parameters/nats-parameter.js'
import type { ResolvedNatsExceptionFilter } from './exception-filters/nats-exception-filter.js'

export type CreateStreamConfig = Parameters<StreamAPI['add']>['0'] & {
  connectionOptions: NamedConnectionOptions
}

export interface CreateServiceConfig extends ServiceConfig {
  connectionOptions: NamedConnectionOptions
}

export interface CreateServiceEndpointConfig extends EndpointOptions {
  classExceptionFilters: ResolvedNatsExceptionFilter[]
  name: string
  event?: CloudEventHandlerOptions
  exceptionFilters: ResolvedNatsExceptionFilter[]
  service: CreateServiceConfig
  parameters: NatsParameter[]
  callback: (...args: unknown[]) => Promise<unknown>
}

export interface CreateConsumerHandlerConfig {
  classExceptionFilters: ResolvedNatsExceptionFilter[]
  event?: CloudEventHandlerOptions
  consumer: NatsConsumerConfig
  exceptionFilters: ResolvedNatsExceptionFilter[]
  parameters: NatsParameter[]
  callback: (...args: unknown[]) => Promise<unknown>
}

export interface CreateSubscriberHandlerConfig {
  classExceptionFilters: ResolvedNatsExceptionFilter[]
  event?: CloudEventHandlerOptions
  exceptionFilters: ResolvedNatsExceptionFilter[]
  subscriber: NatsSubscriberConfig
  parameters: NatsParameter[]
  callback: (...args: unknown[]) => Promise<unknown>
}

export class NatsApplication {
  private connectionManager: NatsConnectionManager
  private serviceManager: NatsServiceManager
  private subscriberManager: NatsSubscriberManager
  private consumerManager: NatsConsumerManager
  private streamManager: NatsStreamManager

  constructor () {
    this.connectionManager = new NatsConnectionManager()
    this.serviceManager = new NatsServiceManager(this.connectionManager)
    this.subscriberManager = new NatsSubscriberManager(this.connectionManager)
    this.consumerManager = new NatsConsumerManager(this.connectionManager)
    this.streamManager = new NatsStreamManager(this.connectionManager)
  }

  async establishStream (config: CreateStreamConfig): Promise<void> {
    await this.streamManager.establishStream(config)
  }

  async addServiceEndpoint (config: CreateServiceEndpointConfig): Promise<void> {
    const service = await this.serviceManager.createService(config.service)

    service.addEndpoint(config)
    Logger.log(
      `Registered endpoint ${config.name} in ${service.info().name} `
      + `(${service.info().version}) listening on ${config?.subject ?? 'no subject'}`,
      'NATS'
    )
  }

  async addConsumerHandler (config: CreateConsumerHandlerConfig): Promise<void> {
    const consumer = await this.consumerManager.createConsumer(config.consumer)
    const paramContext: NatsParameterContext = { subject: config.consumer.filter_subject ?? '' }

    config.parameters.forEach(param => param.setContext(paramContext))

    const handler = new NatsMessageHandlerFunction(
      config.parameters, 
      config.callback,
      config.consumer.name + '.' + config.callback.name,
      config.exceptionFilters
    )

    consumer.addExceptionFilters(config.classExceptionFilters)

    if (config.event !== undefined) {
      consumer.addCloudEventHandler(config.event, handler)
    } else {
      consumer.addFallBackHandler(handler)
    }
  }

  async addSubscriberHandler (config: CreateSubscriberHandlerConfig): Promise<void> {
    const subscriber = await this.subscriberManager.createSubscriber(config.subscriber)
    const paramContext: NatsParameterContext = { subject: config.subscriber.subject }

    config.parameters.forEach(param => param.setContext(paramContext))

    const handler = new NatsMessageHandlerFunction(
      config.parameters,
      config.callback,
      config.subscriber.name + '.' + config.callback.name,
      config.exceptionFilters
    )

    subscriber.addExceptionFilters(config.classExceptionFilters)

    if (config.event !== undefined) {
      subscriber.addCloudEventHandler(config.event, handler)
    } else {
      subscriber.addFallBackHandler(handler)
    }
  }

  listen (): void {
    this.subscriberManager.startSubscribers()
    this.consumerManager.startConsumers()
    this.serviceManager.startServices()
  }

  async close (): Promise<void> {
    await Promise.allSettled([
      this.subscriberManager.close(),
      this.consumerManager.close()
    ])

    await this.connectionManager.drainConnections()
  }
}
