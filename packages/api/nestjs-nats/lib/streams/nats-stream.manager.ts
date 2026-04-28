import type { StreamInfo } from '@nats-io/jetstream'
import { jetstreamManager } from '@nats-io/jetstream'
import { jserrors } from '@nats-io/jetstream/internal'
import { Logger } from '@nestjs/common'
import { NatsConnectionManager } from '#src/connections/nats-connection.manager.js'
import type { CreateStreamConfig } from '#src/nats-application.js'

export class NatsStreamManager {
  constructor (private connectionManager: NatsConnectionManager) {}

  async establishStream (config: CreateStreamConfig): Promise<StreamInfo> {
    const connection = await this.connectionManager.connect(config.connectionOptions)
    const manager = await jetstreamManager(connection)
    const { connectionOptions, ...sanitizedConfig } = config

    try {
      const stream = await manager.streams.update(config.name, sanitizedConfig)

      Logger.log(`Updated stream ${config.name}`, 'NATS')

      return stream
    } catch (e) {
      if (!(e instanceof jserrors.StreamNotFoundError)) {
        throw e
      }

      const stream = await manager.streams.add(sanitizedConfig)

      Logger.log(`Created stream ${config.name}`, 'NATS')

      return stream
    }
  }
}
