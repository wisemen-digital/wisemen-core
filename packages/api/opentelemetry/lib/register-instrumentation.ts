import { ClientRequest, IncomingMessage } from 'http'
import { createRequire } from 'node:module'
import { Instrumentation, registerInstrumentations } from '@opentelemetry/instrumentation'
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis'
import { ExpressInstrumentation, ExpressLayerType } from '@opentelemetry/instrumentation-express'
import { UndiciInstrumentation, UndiciRequest } from '@opentelemetry/instrumentation-undici'
import { Span } from '@opentelemetry/api'

const requireCjs = createRequire(import.meta.url)

const MODULES_LOADED_BEFORE_REGISTRATION = ['http', 'https']

function patchModulesLoadedBeforeRegistration (): void {
  for (const moduleName of MODULES_LOADED_BEFORE_REGISTRATION) {
    requireCjs(moduleName)
  }
}

export function registerInstrumentation (
  extraInstrumentations: Instrumentation[] = []
): void {
  registerInstrumentations({
    instrumentations: [
      new PgInstrumentation({
        enhancedDatabaseReporting: false,
        requireParentSpan: true,
        ignoreConnectSpans: true,
      }),
      new HttpInstrumentation({
        requestHook: (span: Span, request: ClientRequest | IncomingMessage): void => {
          if (request instanceof ClientRequest) {
            const outgoingRoute = (request.host ?? '') + (request.path?.split('?')[0] ?? '')

            span.updateName(`${request.method} ${outgoingRoute}`)
          } else {
            const incomingRoute = request.url?.split('?')[0]

            span.updateName(`${request.method} ${incomingRoute}`)
          }
        }
      }),
      new ExpressInstrumentation({
        ignoreLayersType: [ExpressLayerType.MIDDLEWARE, ExpressLayerType.REQUEST_HANDLER]
      }),
      new NestInstrumentation({}),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true
      }),
      new RedisInstrumentation({
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
      }),
      new UndiciInstrumentation({
        requestHook: (span: Span, request: UndiciRequest): void => {
          const outgoingRoute = request.origin + request.path.split('?')[0]
          span.updateName(`${request.method} ${outgoingRoute}`)
        }
      }),
      ...extraInstrumentations
    ]
  })

  patchModulesLoadedBeforeRegistration()
}
