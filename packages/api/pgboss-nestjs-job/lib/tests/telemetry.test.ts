import 'reflect-metadata'
import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'
import { Reflector } from '@nestjs/core'
import type { EntityManager } from 'typeorm'
import {
  context,
  propagation,
  ROOT_CONTEXT,
  SpanKind,
  trace,
  type SpanContext
} from '@opentelemetry/api'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { W3CTraceContextPropagator } from '@opentelemetry/core'
import {
  BasicTracerProvider,
  InMemorySpanExporter,
  SimpleSpanProcessor,
  type ReadableSpan
} from '@opentelemetry/sdk-trace-base'
import { PgBossClient } from '../client/pgboss-client.js'
import { BaseJob } from '../jobs/base-job.js'
import { PgBossJob } from '../jobs/job.decorator.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { SerializedJob } from '../jobs/serialized-job.js'
import { TraceContextCarrier } from '../jobs/trace-context-carrier.js'
import { PgBossScheduler } from '../scheduler/pgboss-scheduler.js'
import { RawPgBossJob } from '../worker/pgboss-worker.constants.js'
import { PgBossWorkerThread } from '../worker/pgboss-worker.thread.js'

const QUEUE_NAME = 'telemetry-test'

@PgBossJob(QUEUE_NAME)
class TelemetryJob extends BaseJob<{ iteration: number }> {}

interface TestClient {
  client: PgBossClient
  completedJobIds: string[]
  failedJobIds: string[]
}

function createClient (): TestClient {
  const completedJobIds: string[] = []
  const failedJobIds: string[] = []

  const client = {
    complete (_queue: string, id: string): Promise<void> {
      completedJobIds.push(id)

      return Promise.resolve()
    },
    fail (_queue: string, id: string): Promise<void> {
      failedJobIds.push(id)

      return Promise.resolve()
    }
  } as unknown as PgBossClient

  return { client, completedJobIds, failedJobIds }
}

function createScheduler (): {
  scheduler: PgBossScheduler
  insertedJobs: SerializedJob[][]
} {
  const insertedJobs: SerializedJob[][] = []
  const client = {
    insert (_queue: string, jobs: SerializedJob[]): Promise<void> {
      insertedJobs.push(jobs)

      return Promise.resolve()
    }
  } as unknown as PgBossClient

  const scheduler = new PgBossScheduler(
    client,
    new Reflector(),
    {} as EntityManager
  )

  return { scheduler, insertedJobs }
}

function createRawJob (
  id: string,
  data: { iteration: number },
  traceContext?: TraceContextCarrier
): RawPgBossJob {
  return {
    id,
    name: QUEUE_NAME,
    data: {
      className: TelemetryJob.name,
      classData: data,
      traceContext
    }
  } as RawPgBossJob
}

function createRawJobFromSerialized (id: string, job: SerializedJob): RawPgBossJob {
  return {
    id,
    name: job.name,
    data: job.data
  } as RawPgBossJob
}

async function * createQueue (jobs: RawPgBossJob[]): AsyncGenerator<RawPgBossJob, void, unknown> {
  await Promise.resolve()

  for (const job of jobs) {
    yield job
  }
}

function getSpan (spans: ReadableSpan[], name: string): ReadableSpan {
  const span = spans.find(candidate => candidate.name === name)

  assert.ok(span, `Expected span named ${name}`)

  return span
}

function getPropagatedSpanContext (carrier: TraceContextCarrier): SpanContext {
  const extractedContext = propagation.extract(ROOT_CONTEXT, carrier)
  const spanContext = trace.getSpanContext(extractedContext)

  assert.ok(spanContext)

  return spanContext
}

describe('pg-boss OpenTelemetry boundaries', { concurrency: false }, () => {
  const exporter = new InMemorySpanExporter()
  const provider = new BasicTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(exporter)]
  })
  const contextManager = new AsyncLocalStorageContextManager()

  before(() => {
    context.setGlobalContextManager(contextManager.enable())
    propagation.setGlobalPropagator(new W3CTraceContextPropagator())
    trace.setGlobalTracerProvider(provider)
  })

  beforeEach(() => {
    exporter.reset()
  })

  after(async () => {
    await provider.shutdown()
    context.disable()
    propagation.disable()
    trace.disable()
  })

  it('emits a producer span and injects its context into scheduled jobs', async () => {
    const { scheduler, insertedJobs } = createScheduler()

    await scheduler.scheduleJobs([
      new TelemetryJob({ iteration: 1 }),
      new TelemetryJob({ iteration: 2 })
    ])

    assert.equal(insertedJobs.length, 1)
    assert.equal(insertedJobs[0].length, 2)

    const span = getSpan(exporter.getFinishedSpans(), `send ${QUEUE_NAME}`)
    const traceContext = insertedJobs[0][0].data?.traceContext

    assert.ok(traceContext)
    assert.equal(span.kind, SpanKind.PRODUCER)
    assert.deepEqual(span.attributes, {
      'messaging.system': 'pg_boss',
      'messaging.destination.name': QUEUE_NAME,
      'messaging.operation.name': 'send',
      'messaging.operation.type': 'send',
      'messaging.batch.message_count': 2
    })

    const propagatedSpanContext = getPropagatedSpanContext(traceContext)

    assert.equal(propagatedSpanContext.traceId, span.spanContext().traceId)
    assert.equal(propagatedSpanContext.spanId, span.spanContext().spanId)
    assert.equal(propagatedSpanContext.traceFlags, span.spanContext().traceFlags)
    assert.deepEqual(insertedJobs[0][1].data?.traceContext, traceContext)
  })

  it('starts a linked root consumer and keeps handler spans as children', async () => {
    const tracer = trace.getTracer('pgboss-telemetry-test')
    const traceContext: TraceContextCarrier = {}

    tracer.startActiveSpan('scheduling source', (span) => {
      propagation.inject(context.active(), traceContext)
      span.end()
    })

    const handler = {
      run (): void {
        tracer.startActiveSpan('handler child', (span) => {
          span.end()
        })
      }
    }
    const registry = {
      get () {
        return Promise.resolve(handler)
      }
    } as unknown as JobRegistry
    const testClient = createClient()
    const worker = new PgBossWorkerThread(
      createQueue([createRawJob('job-1', { iteration: 1 }, traceContext)]),
      testClient.client,
      registry
    )

    await worker.run()

    const spans = exporter.getFinishedSpans()
    const producer = getSpan(spans, 'scheduling source')
    const consumer = getSpan(spans, TelemetryJob.name)
    const handlerChild = getSpan(spans, 'handler child')
    const propagatedSpanContext = getPropagatedSpanContext(traceContext)

    assert.equal(consumer.parentSpanContext, undefined)
    assert.notEqual(consumer.spanContext().traceId, producer.spanContext().traceId)
    assert.equal(consumer.kind, SpanKind.CONSUMER)
    assert.equal(consumer.links.length, 1)
    assert.deepEqual(consumer.links[0].context, propagatedSpanContext)
    assert.equal(handlerChild.parentSpanContext?.spanId, consumer.spanContext().spanId)
    assert.equal(handlerChild.spanContext().traceId, consumer.spanContext().traceId)
    assert.deepEqual(consumer.attributes, {
      'messaging.system': 'pg_boss',
      'messaging.destination.name': QUEUE_NAME,
      'messaging.operation.name': 'process',
      'messaging.operation.type': 'process',
      'job.name': TelemetryJob.name,
      'job.queue': QUEUE_NAME,
      'job.id': 'job-1'
    })
    assert.deepEqual(testClient.completedJobIds, ['job-1'])
    assert.deepEqual(testClient.failedJobIds, [])
  })

  it('links a recurring execution to its predecessor producer without sharing its trace', async () => {
    const { scheduler, insertedJobs } = createScheduler()
    const testClient = createClient()
    const handler = {
      async run (data: { iteration: number }): Promise<void> {
        if (data.iteration === 1) {
          await scheduler.scheduleJob(new TelemetryJob({ iteration: 2 }))
        }
      }
    }
    const registry = {
      get () {
        return Promise.resolve(handler)
      }
    } as unknown as JobRegistry

    const firstWorker = new PgBossWorkerThread(
      createQueue([createRawJob('job-1', { iteration: 1 })]),
      testClient.client,
      registry
    )

    await firstWorker.run()

    assert.equal(insertedJobs.length, 1)
    assert.equal(insertedJobs[0].length, 1)

    const successor = createRawJobFromSerialized('job-2', insertedJobs[0][0])
    const secondWorker = new PgBossWorkerThread(
      createQueue([successor]),
      testClient.client,
      registry
    )

    await secondWorker.run()

    const spans = exporter.getFinishedSpans()
    const consumers = spans.filter(span => span.name === TelemetryJob.name)
    const firstConsumer = consumers.find(span => span.attributes['job.id'] === 'job-1')
    const secondConsumer = consumers.find(span => span.attributes['job.id'] === 'job-2')
    const producer = getSpan(spans, `send ${QUEUE_NAME}`)
    const successorTraceContext = successor.data.traceContext

    assert.ok(firstConsumer)
    assert.ok(secondConsumer)
    assert.ok(successorTraceContext)
    assert.notEqual(firstConsumer.spanContext().traceId, secondConsumer.spanContext().traceId)
    assert.equal(producer.parentSpanContext?.spanId, firstConsumer.spanContext().spanId)
    assert.equal(producer.spanContext().traceId, firstConsumer.spanContext().traceId)
    assert.equal(secondConsumer.links.length, 1)
    assert.deepEqual(
      secondConsumer.links[0].context,
      getPropagatedSpanContext(successorTraceContext)
    )
    assert.equal(secondConsumer.links[0].context.spanId, producer.spanContext().spanId)
  })

  it('processes missing and invalid carriers as unlinked roots', async () => {
    const testClient = createClient()
    const registry = {
      get () {
        return Promise.resolve({ run () {} })
      }
    } as unknown as JobRegistry
    const worker = new PgBossWorkerThread(
      createQueue([
        createRawJob('missing-context', { iteration: 1 }),
        createRawJob('invalid-context', { iteration: 2 }, { traceparent: 'invalid' })
      ]),
      testClient.client,
      registry
    )

    await worker.run()

    const consumers = exporter.getFinishedSpans()
      .filter(span => span.name === TelemetryJob.name)

    assert.equal(consumers.length, 2)
    for (const consumer of consumers) {
      assert.equal(consumer.parentSpanContext, undefined)
      assert.deepEqual(consumer.links, [])
    }
    assert.deepEqual(testClient.completedJobIds, ['missing-context', 'invalid-context'])
    assert.deepEqual(testClient.failedJobIds, [])
  })
})
