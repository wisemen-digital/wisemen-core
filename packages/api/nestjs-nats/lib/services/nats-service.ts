import type { Service, ServiceInfo } from '@nats-io/services'
import { NatsServiceEndpoint } from './nats-service-endpoint.js'
import { NatsMessageHandlerFunction } from '#src/message-handler/nats-message-handler.js'
import type { CreateServiceEndpointConfig } from '#src/nats-application.js'
import type { NatsParameterContext } from '#src/parameters/nats-parameter.js'

export class NatsService {
  private endpoints: Map<string, NatsServiceEndpoint> = new Map()

  constructor (private service: Service) {}

  addEndpoint (config: CreateServiceEndpointConfig): void {
    let endpoint = this.endpoints.get(config.name)
    const subject = config.subject?.replaceAll(/:[\w]+/g, '*')
    const parsedConfig = { ...config, subject }

    if (endpoint === undefined) {
      const stream = this.service.addEndpoint(config.name, parsedConfig)

      endpoint = new NatsServiceEndpoint(config.name, stream)
      this.endpoints.set(config.name, endpoint)
    }

    const paramContext: NatsParameterContext = { subject: config.subject ?? '' }

    config.parameters.forEach(param => param.setContext(paramContext))

    const handler = new NatsMessageHandlerFunction(config.parameters, config.callback)

    if (config.event !== undefined) {
      endpoint.addCloudEventHandler(config.event, handler)
    } else {
      endpoint.addFallBackHandler(handler)
    }
  }

  info (): ServiceInfo {
    return this.service.info()
  }

  listen (): void {
    for (const endpoint of this.endpoints.values()) {
      void endpoint.listen()
    }
  }
}
