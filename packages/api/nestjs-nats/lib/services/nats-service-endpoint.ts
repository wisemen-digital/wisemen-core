import type { Msg, QueuedIterator } from '@nats-io/transport-node'
import { HttpStatus, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import type { ServiceMsg } from '@nats-io/services'
import type { NatsMessageHandlerFunction } from '#src/message-handler/nats-message-handler.js'
import type { CloudEventHandlerOptions } from '#src/message-handler/on-nats-message.decorator.js'
import { CloudEvent } from '#src/cloud-event/cloud-event.js'
import { NatsExceptionHandler } from '#src/exception-filters/nats-exception-handler.js'
import type { ResolvedNatsExceptionFilter } from '#src/exception-filters/nats-exception-filter.js'

type CloudEventKey = string

export class NatsServiceEndpoint {
  private fallbackHandler: NatsMessageHandlerFunction | undefined
  private cloudEventHandlers: Map<CloudEventKey, NatsMessageHandlerFunction> = new Map()
  private readonly exceptionFilters: ResolvedNatsExceptionFilter[] = []
  private readonly exceptionHandler = new NatsExceptionHandler()

  constructor (
    private name: string,
    private stream: QueuedIterator<ServiceMsg>
  ) {}

  addExceptionFilters (filters: ResolvedNatsExceptionFilter[]): void {
    for (const filter of filters) {
      if (this.exceptionFilters.some(existing => existing.filter === filter.filter)) {
        continue
      }

      this.exceptionFilters.push(filter)
    }
  }

  addCloudEventHandler (
    eventOptions: CloudEventHandlerOptions,
    handler: NatsMessageHandlerFunction
  ): void {
    const key = this.mapEventOptionsToKey(eventOptions)

    if (this.cloudEventHandlers.get(key) !== undefined) {
      throw new Error(
        `A cloud event handler already exists for `
        + `${eventOptions.type} (${eventOptions.specversion}) on`
        + ` endpoint ${this.name}`
      )
    }

    Logger.log(
      'Registered cloud event handler on '
      + `endpoint ${this.name} for `
      + `${eventOptions.type} (${eventOptions.specversion})`,
      'NATS'
    )

    this.cloudEventHandlers.set(key, handler)
  }

  addFallBackHandler (handler: NatsMessageHandlerFunction): void {
    if (this.fallbackHandler !== undefined) {
      throw new Error(
        `Fallback handler already set for ${this.name}`
        + `\nDid you add two @OnNatsMessage() handlers to one @NatsServiceEndpoint({...})?`
      )
    }

    Logger.log(`Registered fallback message handler on endpoint ${this.name}`, 'NATS')

    this.fallbackHandler = handler
  }

  async listen (): Promise<void> {
    for await (const message of this.stream) {
      // Handle messages one by one
      await this.handleMessage(message)
    }
  }

  private async handleMessage (message: ServiceMsg): Promise<void> {
    let handler: NatsMessageHandlerFunction | undefined

    try {
      handler = await this.getHandler(message)
      const response = await handler.handle(message)

      if (response instanceof Uint8Array) {
        message.respond(response)
      } else {
        message.respond(new TextEncoder().encode(JSON.stringify(response)))
      }
    } catch (e) {
      const result = await this.exceptionHandler.handle(e, {
        captureMessage: 'unable to handle service request message',
        filters: handler?.filters ?? this.exceptionFilters,
        handlerName: handler?.handlerContext,
        logContext: `NATS endpoint ${this.name}`,
        message
      })

      if (result.response !== undefined) {
        message.respondError(
          result.response.code,
          result.response.description,
          result.response.data
        )
        return
      }

      if (!result.responded) {
        message.respondError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          e instanceof Error ? e.message : 'unknown cause',
          JSON.stringify(e)
        )
      }
    }
  }

  private async getHandler (message: Msg): Promise<NatsMessageHandlerFunction> {
    if (this.cloudEventHandlers.size > 0) {
      try {
        const cloudEventKey = await this.tryParseCloudEventKey(message)
        const handler = this.cloudEventHandlers.get(cloudEventKey)

        if (handler !== undefined) {
          return handler
        }
      } catch {
        // ignore non cloud events and fall through to fallback handler
      }
    }

    if (this.fallbackHandler === undefined) {
      throw new Error(
        `No handler found for message on NATS endpoint ${this.name}.`
        + '\nDid you forget to add a fallback @OnNatsMessage() handler?'
      )
    }

    return this.fallbackHandler
  }

  private async tryParseCloudEventKey (message: Msg): Promise<CloudEventKey> {
    const json = JSON.parse(new TextDecoder().decode(message.data)) as unknown
    const event = plainToInstance(CloudEvent, json)
    const errors = await validate(event, { whitelist: true, forbidNonWhitelisted: false })

    if (errors.length > 0) {
      throw new Error(`Invalid cloud event: ${JSON.stringify(json)}`, { cause: errors })
    }

    return event.type + ':' + event.specversion
  }

  private mapEventOptionsToKey (event: CloudEventHandlerOptions): CloudEventKey {
    return event.type + ':' + event.specversion
  }
}
