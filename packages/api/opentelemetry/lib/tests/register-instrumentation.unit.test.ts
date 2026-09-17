import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici'
import { FastifyOtelInstrumentation } from '@fastify/otel'
import type { Span } from '@opentelemetry/api'
import {
  addPostgresQuerySummary,
  createDefaultInstrumentations,
  renameAnonymousFastifySpan,
  shouldIgnoreFastifyRoute,
  shouldIgnoreIncomingRequest,
  shouldIgnoreOutgoingRequest,
  shouldIgnoreUndiciRequest
} from '../register-instrumentation.js'

describe('trace-volume instrumentation hooks', () => {
  it('ignores exact health routes including query strings', () => {
    assert.equal(shouldIgnoreIncomingRequest({ url: '/health' } as never), true)
    assert.equal(shouldIgnoreIncomingRequest({ url: '/ready?verbose=true' } as never), true)
    assert.equal(shouldIgnoreIncomingRequest({ url: '/healthz' } as never), false)
    assert.equal(shouldIgnoreIncomingRequest({ url: '/api/health' } as never), false)
  })

  it('ignores the same health routes for Fastify routes', () => {
    assert.equal(shouldIgnoreFastifyRoute({ url: '/health' }), true)
    assert.equal(shouldIgnoreFastifyRoute({ url: '/ready' }), true)
    // Fastify passes the raw request url, query string included.
    assert.equal(shouldIgnoreFastifyRoute({ url: '/health?verbose=true' }), true)
    assert.equal(shouldIgnoreFastifyRoute({ url: '/healthz' }), false)
    assert.equal(shouldIgnoreFastifyRoute({ url: '/api/health' }), false)
  })

  it('renames plugin-chain span names after the route, and leaves real names alone', () => {
    const renamed: string[] = []
    const span = { updateName (name: string) { renamed.push(name); return this } } as unknown as Span

    renameAnonymousFastifySpan(span, {
      hookName: 'handler',
      handler: 'fastify -> @fastify/otel -> @fastify/middie',
      request: { routeOptions: { url: '/api/v1/users' } }
    } as never)
    assert.deepEqual(renamed, ['handler - /api/v1/users'])

    renameAnonymousFastifySpan(span, {
      hookName: 'onRequest',
      handler: 'fastify -> @fastify/cors',
      request: {}
    } as never)
    assert.deepEqual(renamed.at(-1), 'onRequest - anonymous')

    renameAnonymousFastifySpan(span, {
      hookName: 'onRequest',
      handler: 'runMiddie',
      request: { routeOptions: { url: '/api/v1/users' } }
    } as never)
    assert.equal(renamed.length, 2, 'named handlers are left alone')
  })

  it('ignores the exact Better Stack hostname for HTTP and Undici', () => {
    assert.equal(shouldIgnoreOutgoingRequest({ hostname: 'uptime.betterstack.com' }), true)
    assert.equal(shouldIgnoreOutgoingRequest({ hostname: 'UPTIME.BETTERSTACK.COM' }), true)
    assert.equal(shouldIgnoreOutgoingRequest({ host: 'uptime.betterstack.com:443' }), true)
    assert.equal(shouldIgnoreOutgoingRequest({ hostname: 'api.betterstack.com' }), false)
    assert.equal(shouldIgnoreOutgoingRequest({ hostname: 'fakeuptime.betterstack.com' }), false)
    assert.equal(shouldIgnoreUndiciRequest({ origin: 'https://uptime.betterstack.com' } as never), true)
    assert.equal(shouldIgnoreUndiciRequest({ origin: 'https://api.betterstack.com' } as never), false)
    assert.equal(shouldIgnoreUndiciRequest({ origin: 'https://uptime.betterstack.com.example.com' } as never), false)
    assert.equal(shouldIgnoreUndiciRequest({ origin: 'not a URL' } as never), false)
  })

  it('adds query summary attributes and updates the span name', () => {
    const attributes: Record<string, unknown> = {}
    let name: string | undefined
    const span = {
      setAttribute (key: string, value: unknown) {
        attributes[key] = value

        return this
      },
      updateName (updatedName: string) {
        name = updatedName

        return this
      }
    } as unknown as Span

    addPostgresQuerySummary(span, {
      connection: {},
      query: { text: 'SELECT * FROM payment WHERE uuid = $1' }
    })

    assert.deepEqual(attributes, {
      'db.collection.name': 'payment',
      'db.operation.name': 'SELECT',
      'db.query.summary': 'SELECT payment'
    })
    assert.equal(name, 'SELECT payment')
  })

  it('omits summary attributes when parsing fails', () => {
    let called = false
    const span = {
      setAttribute () {
        called = true

        return this
      },
      updateName () {
        called = true

        return this
      }
    } as unknown as Span

    addPostgresQuerySummary(span, {
      connection: {},
      query: { text: 'SAVEPOINT before_payment' }
    })

    assert.equal(called, false)
  })

  it('registers reduction hooks', () => {
    const defaults = createDefaultInstrumentations()
    const defaultHttp = defaults.find(value => value instanceof HttpInstrumentation) as HttpInstrumentation
    const defaultPg = defaults.find(value => value instanceof PgInstrumentation) as PgInstrumentation
    const defaultUndici = defaults.find(value => value instanceof UndiciInstrumentation) as UndiciInstrumentation

    assert.equal(defaultHttp.getConfig().ignoreIncomingRequestHook, shouldIgnoreIncomingRequest)
    assert.equal(defaultHttp.getConfig().ignoreOutgoingRequestHook, shouldIgnoreOutgoingRequest)
    assert.equal(defaultPg.getConfig().requestHook, addPostgresQuerySummary)
    assert.equal(defaultUndici.getConfig().ignoreRequestHook, shouldIgnoreUndiciRequest)

    const defaultFastify = defaults
      .find(value => value instanceof FastifyOtelInstrumentation) as FastifyOtelInstrumentation

    assert.equal(defaultFastify.getConfig().ignorePaths, shouldIgnoreFastifyRoute)
    assert.equal(defaultFastify.getConfig().registerOnInitialization, true)
    assert.deepEqual(
      defaultFastify.getConfig().instrumentHooks,
      ['onRequest', 'preValidation', 'preHandler', 'onError']
    )
    assert.equal(defaultFastify.getConfig().instrumentHandler, true)
    assert.equal(defaultFastify.getConfig().lifecycleHook, renameAnonymousFastifySpan)
  })

  it('retains extra instrumentations', () => {
    const extra = new HttpInstrumentation()
    const instrumentations = createDefaultInstrumentations([extra])

    assert.equal(instrumentations.at(-1), extra)
  })
})
