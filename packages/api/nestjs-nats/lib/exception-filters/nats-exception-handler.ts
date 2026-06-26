import { Logger } from '@nestjs/common'
import { JsonApiError } from '@wisemen/api-error'
import { captureException } from '@wisemen/opentelemetry'
import { NatsExecutionContextHost, type NatsContextMessage } from './nats-arguments-host.js'
import { isNatsServiceErrorResponse, type NatsServiceErrorResponse, type ResolvedNatsExceptionFilter } from './nats-exception-filter.js'

interface NatsExceptionContext {
  captureMessage: string
  filters?: ResolvedNatsExceptionFilter[]
  handlerName?: string
  logContext: string
  message: NatsContextMessage
}

export interface NatsExceptionHandlingResult {
  handled: boolean
  responded: boolean
  response?: NatsServiceErrorResponse
}

export class NatsExceptionHandler {
  async handle (
    exception: unknown,
    context: NatsExceptionContext
  ): Promise<NatsExceptionHandlingResult> {
    const host = new NatsExecutionContextHost(context.message, context.handlerName)

    for (const filter of context.filters ?? []) {
      if (!this.matches(filter, exception)) {
        continue
      }

      const result = await filter.filter.catch(exception, host)

      return {
        handled: true,
        responded: host.hasResponded,
        response: isNatsServiceErrorResponse(result) ? result : undefined
      }
    }

    const errorMessage = this.getErrorMessage(exception)
    const error = new Error(`${context.captureMessage}: ${errorMessage}`, { cause: exception })

    Logger.error(
      `Nats message handler threw error ${errorMessage}`,
      context.logContext
    )
    captureException(error)

    return {
      handled: false,
      responded: host.hasResponded
    }
  }

  private matches (filter: ResolvedNatsExceptionFilter, exception: unknown): boolean {
    if (filter.exceptions.length === 0) {
      return true
    }

    return filter.exceptions.some(exceptionType => exception instanceof exceptionType)
  }

  private getErrorMessage (exception: unknown): string {
    if (exception instanceof JsonApiError) {
      return `[${exception.status}]: ${JSON.stringify(exception.errors)}`
    }

    if (exception instanceof Error) {
      return exception.message ?? 'unknown cause'
    }

    return 'unknown cause'
  }
}
