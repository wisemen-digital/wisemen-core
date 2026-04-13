import type { StreamInfo } from '@nats-io/jetstream'
import { jetstreamManager } from '@nats-io/jetstream'
import { jserrors } from '@nats-io/jetstream/internal'
import type { NatsConnection } from '@nats-io/transport-node'
import { Logger } from '@nestjs/common'
import { NatsConnectionManager } from '#src/connections/nats-connection.manager.js'
import type { CreateStreamConfig } from '#src/nats-application.js'

export class NatsStreamManager {
  constructor (private connectionManager: NatsConnectionManager) {}

  async establishStream (config: CreateStreamConfig): Promise<StreamInfo> {
    let connection: NatsConnection

    try {
      connection = await this.connectionManager.connect(config.connectionOptions)
    } catch (e) {
      throw new Error(
        'Unable to establish stream'
        + '\nDid you forget to add a default client to the nats application?'
        + '\nDid you forget to set a specific client on the stream options?'
        + `\nError: ${JSON.stringify(e)}`
      )
    }

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
