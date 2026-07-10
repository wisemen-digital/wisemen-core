import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { ClassConstructor } from 'class-transformer'
import { type Payload, headers, type MsgHdrs } from '@nats-io/transport-node'
import { jetstream, type JetStreamPublishOptions, type PubAck } from '@nats-io/jetstream'
import { context, propagation, type Context } from '@opentelemetry/api'
import type { TraceContextCarrier } from '@wisemen/opentelemetry'
import { NatsConnectionManager } from '../connections/nats-connection.manager.js'
import { getNatsStreamConfig } from './nats-stream.decorator.js'

/**
 * Publishes messages onto JetStream streams declared through the `@NatsStream(...)`
 * decorator and registered with `NatsModule.forRoot({ streams: [...] })`.
 *
 * The stream is resolved from its class so publishing reuses the same connection the
 * stream is managed on. The subject must be captured by the stream's configured
 * `subjects`, otherwise the server rejects the publish.
 */
@Injectable()
export class NatsStreamPublisher {
  constructor (
    private readonly connectionManager: NatsConnectionManager,
    private readonly config: ConfigService
  ) {}

  /**
   * Publishes a message onto the given stream and waits for the server to acknowledge it.
   *
   * @param stream a class decorated with `@NatsStream(...)`
   * @param subject the subject to publish to; must match one of the stream's `subjects`
   * @param message the message payload
   * @param options optional JetStream publish options (e.g. `msgID` for deduplication)
   */
  async publish (
    stream: ClassConstructor<unknown>,
    subject: string,
    message: Payload | undefined,
    options?: Partial<JetStreamPublishOptions>
  ): Promise<PubAck> {
    const { connectionOptions } = getNatsStreamConfig(stream, this.config)
    const connection = await this.connectionManager.connect(connectionOptions)
    const natsHeaders = this.buildTraceHeaders(options?.headers)

    return jetstream(connection).publish(subject, message, { ...options, headers: natsHeaders })
  }

  private buildTraceHeaders (existing?: MsgHdrs): MsgHdrs {
    const natsHeaders = existing ?? headers()
    const currentContext: Context = context.active()
    const traceContext: TraceContextCarrier = {}

    propagation.inject(currentContext, traceContext)

    if (traceContext.traceparent != null) {
      natsHeaders.set(
        'traceparent' satisfies keyof TraceContextCarrier,
        traceContext.traceparent
      )
    }

    return natsHeaders
  }
}
