import { ClientRequest, type IncomingMessage, type RequestOptions } from 'http'
import { registerInstrumentations, type Instrumentation } from '@opentelemetry/instrumentation'
import { AwsInstrumentation } from '@opentelemetry/instrumentation-aws-sdk'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core'
import { PgInstrumentation, type PgRequestHookInformation } from '@opentelemetry/instrumentation-pg'
import { RedisInstrumentation } from '@opentelemetry/instrumentation-redis'
import { UndiciInstrumentation, type UndiciRequest } from '@opentelemetry/instrumentation-undici'
import {
  FastifyOtelInstrumentation,
  type FastifyOtelHookName,
  type FastifyOtelLifecycleHookInfo
} from '@fastify/otel'
import type { Span } from '@opentelemetry/api'
import { SqlQuerySummarizer } from './sql-query-summarizer.js'
import { NestLayerInstrumentation } from './nest-layer-instrumentation.js'

const sqlQuerySummarizer = new SqlQuerySummarizer()

const IGNORED_REQUEST_PATHS = new Set([
  '/',
  '/api',
  '/health',
  '/ready'
])

const FASTIFY_PLUGIN_CHAIN_SEPARATOR = ' -> '
const INSTRUMENTED_FASTIFY_HOOKS: FastifyOtelHookName[] = [
  'onRequest',
  'preValidation',
  'preHandler',
  'onError'
]

export function registerInstrumentation (
  extraInstrumentations: Instrumentation[] = []
): void {
  registerInstrumentations({
    instrumentations: createDefaultInstrumentations(extraInstrumentations)
  })
}

export function createDefaultInstrumentations (
  extraInstrumentations: Instrumentation[] = []
): Instrumentation[] {
  return [
    new PgInstrumentation({
      enhancedDatabaseReporting: false,
      requireParentSpan: true,
      ignoreConnectSpans: true,
      requestHook: addPostgresQuerySummary
    }),
    new HttpInstrumentation({
      ignoreIncomingRequestHook: shouldIgnoreIncomingRequest,
      ignoreOutgoingRequestHook: shouldIgnoreOutgoingRequest,
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
    new FastifyOtelInstrumentation({
      registerOnInitialization: true,
      instrumentHooks: INSTRUMENTED_FASTIFY_HOOKS,
      instrumentHandler: true,
      ignorePaths: shouldIgnoreFastifyRoute,
      lifecycleHook: renameAnonymousFastifySpan
    }),
    new NestInstrumentation({}),
    new NestLayerInstrumentation({}),
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
      ignoreRequestHook: shouldIgnoreUndiciRequest,
      requestHook: (span: Span, request: UndiciRequest): void => {
        const outgoingRoute = request.origin + request.path.split('?')[0]
        span.updateName(`${request.method} ${outgoingRoute}`)
      }
    }),
    ...extraInstrumentations
  ]
}

export function addPostgresQuerySummary (span: Span, request: PgRequestHookInformation): void {
  const result = sqlQuerySummarizer.summarize(request.query.text)

  if (result === undefined) {
    return
  }

  span.setAttribute('db.operation.name', result.operation)
  span.setAttribute('db.query.summary', result.summary)
  if (result.collection !== undefined) {
    span.setAttribute('db.collection.name', result.collection)
  }
  span.updateName(result.summary)
}

export function renameAnonymousFastifySpan (
  span: Span,
  info: FastifyOtelLifecycleHookInfo
): void {
  if (info.handler == null || !info.handler.includes(FASTIFY_PLUGIN_CHAIN_SEPARATOR)) {
    return
  }

  const route = (info.request as { routeOptions?: { url?: string } }).routeOptions?.url

  span.updateName(`${info.hookName} - ${route ?? 'anonymous'}`)
}

export function shouldIgnoreFastifyRoute (routeOptions: { url: string }): boolean {
  // Called per request with the raw url, so the query string is still attached.
  const path = routeOptions.url.split('?', 1)[0]

  return IGNORED_REQUEST_PATHS.has(path)
}

export function shouldIgnoreIncomingRequest (request: IncomingMessage): boolean {
  const path = request.url?.split('?', 1)[0]

  return path !== undefined && IGNORED_REQUEST_PATHS.has(path)
}

export function shouldIgnoreOutgoingRequest (request: RequestOptions): boolean {
  return getHttpRequestHostname(request) === 'uptime.betterstack.com'
}

export function shouldIgnoreUndiciRequest (request: UndiciRequest): boolean {
  try {
    return new URL(request.origin).hostname === 'uptime.betterstack.com'
  } catch {
    return false
  }
}

function getHttpRequestHostname (request: RequestOptions): string | undefined {
  if (request.hostname != null) {
    return request.hostname.toLowerCase()
  }

  if (typeof request.host !== 'string') {
    return undefined
  }

  try {
    return new URL(`http://${request.host}`).hostname
  } catch {
    return undefined
  }
}
