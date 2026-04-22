import type { ConnectionOptions, NatsConnection } from '@nats-io/transport-node'
import { AuthorizationError, connect } from '@nats-io/transport-node'
import { Logger } from '@nestjs/common'

export type NamedConnectionOptions = ConnectionOptions & { name: string }

export class NatsConnectionManager {
  private connections: Map<string, NatsConnection> = new Map()

  /**
   * @param options name must be unique —
   * using the same connection name will reuse the same connection even when options differ
   */
  async connect (options: NamedConnectionOptions): Promise<NatsConnection> {
    const existingConnection = this.connections.get(options.name)

    if (existingConnection !== undefined) {
      return existingConnection
    }

    const newConnection = await this.tryConnect(options)

    this.connections.set(options.name, newConnection)

    return newConnection
  }

  async tryConnect (connectionOptions: NamedConnectionOptions): Promise<NatsConnection> {
    try {
      const connection = await connect(connectionOptions)

      Logger.log(
        `Connected to server(s) ${connection.getServer()} as ${connectionOptions.name ?? 'anonymous'}`,
        'NATS'
      )

      return connection
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw new Error('Failed to connect to nats', { cause: error })
      } else {
        throw error
      }
    }
  }

  async drainConnections (): Promise<void> {
    const connections = this.connections.entries()
    const promises: Promise<void>[] = []

    for (const [name, connection] of connections) {
      const promise = new Promise<void>((res, rej) => {
        Logger.debug(`Draining connection ${name}: ...`, 'NATS')
        connection
          .drain()
          .then(() => res())
          .catch((e: Error) => rej(e))
        Logger.debug(`Draining connection ${name}: drained`, 'NATS')
      })

      promises.push(promise)
    }

    await Promise.allSettled(promises)
  }
}
