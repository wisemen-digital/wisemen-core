import type { Consumer, ConsumerInfo, ConsumerMessages, JsMsg } from '@nats-io/jetstream'
import { Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import type { CloudEventHandlerOptions } from '#src/message-handler/on-nats-message.decorator.js'
import type { NatsMessageHandlerFunction } from '#src/message-handler/nats-message-handler.js'
import { CloudEvent } from '#src/cloud-event/cloud-event.js'
import { NatsExceptionHandler } from '#src/exception-filters/nats-exception-handler.js'
import type { ResolvedNatsExceptionFilter } from '#src/exception-filters/nats-exception-filter.js'

type CloudEventKey = string

export class NatsConsumption {
  private fallbackHandler: NatsMessageHandlerFunction | undefined
  private cloudEventHandlers: Map<CloudEventKey, NatsMessageHandlerFunction> = new Map()
  private messages: ConsumerMessages | undefined
  private readonly exceptionFilters: ResolvedNatsExceptionFilter[] = []
  private readonly exceptionHandler = new NatsExceptionHandler()

  constructor (
    private readonly consumerInfo: ConsumerInfo,
    private readonly consumer: Consumer,
    private readonly nakBackoff?: number
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
        + `${eventOptions.type} (${eventOptions.specversion}) on `
        + `consumer ${this.consumerInfo.name}`
      )
    }

    Logger.log(
      'Registered cloud event handler on '
      + `consumer ${this.consumerInfo.name} for `
      + `${eventOptions.type} (${eventOptions.specversion})`,
      'NATS'
    )

    this.cloudEventHandlers.set(key, handler)
  }

  addFallBackHandler (handler: NatsMessageHandlerFunction): void {
    if (this.fallbackHandler !== undefined) {
      throw new Error(
        `Fallback handler already set for consumer ${this.consumerInfo.name}`
        + `\nDid you add two @OnNatsMessage() handlers to one @NatsConsumer({...})?`
      )
    }

    Logger.log(
      'Registered fallback message handler on '
      + `consumer ${this.consumerInfo.name}`,
      'NATS'
    )

    this.fallbackHandler = handler
  }

  async listen (): Promise<void> {
    this.messages = await this.consumer.consume()

    for await (const message of this.messages) {
      // Handle messages one by one
      await this.handleMessage(message)
    }
  }

  async close (): Promise<void> {
    Logger.debug(`Closing consumer ${this.consumerInfo.name}: ...`, 'NATS')
    await this.messages?.close()
    Logger.debug(`Closing consumer ${this.consumerInfo.name}: closed`, 'NATS')
  }

  private async handleMessage (message: JsMsg): Promise<void> {
    let handler: NatsMessageHandlerFunction | undefined

    try {
      handler = await this.getHandler(message)

      await handler.handle(message)
      message.ack()
    } catch (e) {
      await this.exceptionHandler.handle(e, {
        captureMessage: 'unable to handle consumption message',
        filters: handler?.filters ?? this.exceptionFilters,
        handlerName: handler?.handlerContext,
        logContext: `NATS consumer ${this.consumerInfo.name}`,
        message
      })
      message.nak(this.nakBackoff)
    }
  }

  private async getHandler (message: JsMsg): Promise<NatsMessageHandlerFunction> {
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
        `No handler found for message on subject ${message.subject}`
        + `on NATS consumer ${this.consumerInfo.name}.`
        + `\nDid you misconfigure the handler?`
        + '\nDid you forget to add a fallback @OnNatsMessage() handler?'
        + `\nMessage: ${message.data.toString()}`
      )
    }

    return this.fallbackHandler
  }

  private async tryParseCloudEventKey (message: JsMsg): Promise<CloudEventKey> {
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
