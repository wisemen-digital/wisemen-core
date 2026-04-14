/* eslint-disable @typescript-eslint/no-redundant-type-constituents */

import type { JsMsg } from '@nats-io/jetstream'
import type { Msg } from '@nats-io/transport-node'
import type { Context } from '@opentelemetry/api'
import { propagation, context, trace, SpanStatusCode } from '@opentelemetry/api'
import { getOtelTracer, type TraceContextCarrier } from '@wisemen/opentelemetry'
import type { NatsParameter } from '#src/parameters/nats-parameter.js'

export class NatsMessageHandlerFunction {
  constructor (
    private parameters: NatsParameter[],
    private handler: (...args: unknown[]) => unknown | Promise<unknown>
  ) {}

  async handle (message: Msg | JsMsg): Promise<unknown> {
    const traceContext: TraceContextCarrier = {
      traceparent: undefined,
      tracestate: undefined
    }

    const tracer = getOtelTracer()

    for (const [key, value] of message.headers ?? []) {
      if (key in traceContext) {
        traceContext[key as keyof TraceContextCarrier] = Array.isArray(value) ? value[0] : value
      }
    }

    const parentContext: Context = propagation.extract(context.active(), traceContext)
    const span = tracer.startSpan(
      'NatsMessageHandler',
      {
        attributes: {
          subject: `${message.subject}`,
          data: `${message.data?.toString() ?? ''}`
        }
      },
      parentContext
    )

    return await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const args = await this.buildArguments(message)

        return await this.handler(...args)
      } catch (e) {
        span.recordException(e as Error)
        span.setStatus({ code: SpanStatusCode.ERROR })

        if (e instanceof Error) {
          span.setAttribute('exceptions.message', e.message)
          span.setAttribute('exception.stacktrace', e.stack ?? '')
        }

        throw e
      } finally {
        span.end()
      }
    })
  }

  private async buildArguments (message: Msg | JsMsg): Promise<unknown[]> {
    const args: unknown[] = Array.from({ length: this.parameters.length }, () => undefined)

    for (const parameter of this.parameters) {
      const value = await parameter.value(message)

      args[parameter.index] = value
    }

    return args
  }
}
