import { Logger } from '@nestjs/common'
import type { ConsumerConfig, ConsumerInfo, JetStreamManager } from '@nats-io/jetstream'
import { jetstream, jetstreamManager } from '@nats-io/jetstream'
import type { NatsConnection } from '@nats-io/transport-node'
import { NatsConsumption } from './nats-consumption.js'
import { NamedConnectionOptions, NatsConnectionManager } from '#src/connections/nats-connection.manager.js'

export interface NatsConsumerConfig extends Omit<ConsumerConfig, 'callback'> {
  name: string
  connectionOptions?: NamedConnectionOptions
  streamName: string
}

export class NatsConsumerManager {
  private consumers: Map<string, NatsConsumption> = new Map()

  constructor (private connectionManager: NatsConnectionManager) {}

  async createConsumer (config: NatsConsumerConfig): Promise<NatsConsumption> {
    const existingConsumer = this.consumers.get(config.name)

    if (existingConsumer !== undefined) {
      return existingConsumer
    }

    let connection: NatsConnection

    try {
      connection = await this.connectionManager.connect(config.connectionOptions)
    } catch (e) {
      throw new Error(
        'No client specified'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the consumer options?'
        + `\nError: ${JSON.stringify(e)}`
      )
    }

    const subject = config.filter_subject?.replaceAll(/:[\w]+/g, '*')
    const parsedConfig = { ...config, filter_subject: subject }
    const { streamName, name: _, ...consumerConfig } = parsedConfig
    const manager = await jetstreamManager(connection)
    const consumerInfo = await this.registerConsumer(streamName, consumerConfig, manager)
    const consumer = await jetstream(connection).consumers.get(config.streamName, consumerInfo.name)
    const consumption = new NatsConsumption(consumerInfo, consumer)

    Logger.log(`Registered consumer ${consumerInfo.name} on stream ${config.streamName}`, 'NATS')

    this.consumers.set(config.name, consumption)

    return consumption
  }

  startConsumers (): void {
    for (const consumer of this.consumers.values()) {
      void consumer.listen()
    }
  }

  async close (): Promise<void> {
    const promises = Array.from(this.consumers.values()).map(c => c.close())

    await Promise.allSettled(promises)
  }

  private async registerConsumer (
    streamName: string,
    config: ConsumerConfig,
    manager: JetStreamManager
  ): Promise<ConsumerInfo> {
    if (config.durable_name === undefined) {
      return manager.consumers.add(streamName, config)
    }

    try {
      const info = await manager.consumers.info(streamName, config.durable_name)

      await manager.consumers.update(streamName, config.durable_name, config)

      return info
    } catch {
      return manager.consumers.add(streamName, config)
    }
  }
}
