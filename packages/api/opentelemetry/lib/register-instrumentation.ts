import { ClientRequest, IncomingMessage } from 'http'
import { createRequire } from 'module'
import { Instrumentation, registerInstrumentations } from '@opentelemetry/instrumentation'
import { Span } from '@opentelemetry/api'

/** All instrumentation is enabled by default for backwards compatibility */
export interface InstrumentationOptions {
  /**
   * Enable PgInstrumentation.
   * True by default.
   */
  pg?: boolean

  /**
   * Enable HttpInstrumentation.
   * True by default.
   */
  http?: boolean

  /**
   * Enable ExpressInstrumentation.
   * True by default.
   */
  express?: boolean

  /**
   * Enable NestInstrumentation.
   * True by default.
   */
  nest?: boolean

  /**
   * Enable AwsInstrumentation.
   * True by default.
   */
  aws?: boolean

  /**
   * Enable RedisInstrumentation.
   * True by default.
   */
  redis?: boolean

  /**
   * Enable UndiciInstrumentation.
   * True by default.
   */
  undici?: boolean
}

const require = createRequire(import.meta.url)

export function registerInstrumentation (
  extraInstrumentations: Instrumentation[] = [],
  options: InstrumentationOptions = {}
): void {
  const instrumentations = [...extraInstrumentations]

  if (options.pg ?? true) {
    const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg') as typeof import('@opentelemetry/instrumentation-pg')

    instrumentations.push(new PgInstrumentation({
      enhancedDatabaseReporting: false,
      requireParentSpan: true,
      ignoreConnectSpans: true,
    }))
  }

  if (options.http ?? true) {
    const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http') as typeof import('@opentelemetry/instrumentation-http')

    instrumentations.push(new HttpInstrumentation({
      requestHook: (span: Span, request: ClientRequest | IncomingMessage): void => {
        if (request instanceof ClientRequest) {
          const outgoingRoute = (request.host ?? '') + (request.path?.split('?')[0] ?? '')

          span.updateName(`${request.method} ${outgoingRoute}`)
        } else {
          const incomingRoute = request.url?.split('?')[0]

          span.updateName(`${request.method} ${incomingRoute}`)
        }
      }
    }))
  }

  if (options.express ?? true) {
    const { ExpressInstrumentation, ExpressLayerType } = require('@opentelemetry/instrumentation-express') as typeof import('@opentelemetry/instrumentation-express')

    instrumentations.push(
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]
      })
    )
  }

  if (options.nest ?? true) {
    const { NestInstrumentation } = require('@opentelemetry/instrumentation-nestjs-core') as typeof import('@opentelemetry/instrumentation-nestjs-core')

    instrumentations.push(new NestInstrumentation({}))
  }

  if (options.aws ?? true) {
    const { AwsInstrumentation } = require('@opentelemetry/instrumentation-aws-sdk') as typeof import('@opentelemetry/instrumentation-aws-sdk')

    instrumentations.push(new AwsInstrumentation({ suppressInternalInstrumentation: true }))
  }

  if (options.redis ?? true) {
    const { RedisInstrumentation } = require('@opentelemetry/instrumentation-redis') as typeof import('@opentelemetry/instrumentation-redis')

    instrumentations.push(new RedisInstrumentation({
      responseHook: (span: Span, cmdName: string) => {
        span.updateName(`[Redis] ${cmdName}`)
      },
      dbStatementSerializer: (cmdName, cmdArgs) => {
        const maxArgsLength = 100
        const args = cmdArgs.map((arg) => {
          const argStr = arg.toString()

          return argStr.length > maxArgsLength ? `${argStr.substring(0, maxArgsLength)}...` : argStr
        })

        return `${cmdName} ${args.join(' ')}`
      },
      requireParentSpan: true
    }))
  }

  if (options.undici ?? true) {
    const { UndiciInstrumentation } = require('@opentelemetry/instrumentation-undici') as typeof import('@opentelemetry/instrumentation-undici')

    instrumentations.push(new UndiciInstrumentation({
      requestHook: (span: Span, request: { origin: string, path: string, method: string }): void => {
        const outgoingRoute = request.origin + request.path.split('?')[0]
        span.updateName(`${request.method} ${outgoingRoute}`)
      }
    }))
  }

  registerInstrumentations({ instrumentations })
}
