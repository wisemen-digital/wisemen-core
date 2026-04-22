import { Logger } from '@nestjs/common'
import { Svcm } from '@nats-io/services'
import { NatsService } from './nats-service.js'
import { NatsConnectionManager } from '#src/connections/nats-connection.manager.js'
import type { CreateServiceConfig } from '#src/nats-application.js'

export class NatsServiceManager {
  private services: Map<string, NatsService> = new Map()

  constructor (private connectionManager: NatsConnectionManager) {}

  async createService (config: CreateServiceConfig): Promise<NatsService> {
    const existingService = this.services.get(config.name)

    if (existingService !== undefined) {
      return existingService
    }

    const connection = await this.connectionManager.connect(config.connectionOptions)
    const rawService = await new Svcm(connection).add(config)
    const service = new NatsService(rawService)

    Logger.log(`Registered service ${config.name} (${config.version})`, 'NATS')

    this.services.set(config.name, service)

    return service
  }

  startServices (): void {
    for (const service of this.services.values()) {
      service.listen()
    }
  }
}
