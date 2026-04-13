/* eslint-disable no-console */
import { captureException } from '@sentry/nestjs'
import colors from 'colors'
import { getOtelTracer } from '@wisemen/opentelemetry'
import { propagation, context, SpanStatusCode, Context, trace } from '@opentelemetry/api'
import { PgBossClient } from '../client/pgboss-client.js'
import { JobRegistry } from '../jobs/job.registry.js'
import { TraceContextCarrier } from '../jobs/trace-context-carrier.js'
import { RawPgBossJob } from './pgboss-worker.constants.js'

export class PgBossWorkerThread {
  constructor (
    private readonly queue: AsyncGenerator<RawPgBossJob, void, unknown>,
    private readonly client: PgBossClient,
    private readonly jobRegistry: JobRegistry
  ) {}

  async run (): Promise<void> {
    for await (const job of this.queue) {
      try {
        const result = await this.handleJob(job)

        await this.client.complete(job.name, job.id, result ?? undefined)
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        await this.client.fail(job.name, job.id, { error }).catch(() => {})
      }
    }
  }

  private async handleJob (job: RawPgBossJob): Promise<unknown> {
    const startedAt = Date.now()
    const tracer = getOtelTracer()
    const inputTraceContext: TraceContextCarrier = job.data.traceContext ?? {}

    const parentContext: Context = propagation.extract(context.active(), inputTraceContext)

    const span = tracer.startSpan(
      `${job.data.className}`,
      {
        attributes: {
          'job.name': job.data.className,
          'job.queue': job.name,
          'job.id': job.id
        }
      },
      parentContext
    )

    const result = await context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const jobInstance = await this.jobRegistry.get(job.data.className)
        const result = await jobInstance.run(job.data.classData)
        const executionTime = Date.now() - startedAt

        span.addEvent('job.completed', {
          'job.execution_time': executionTime
        })

        console.info(colors.blue(job.data.className), 'succeeded', `(${executionTime}ms)`)

        return result
      } catch (e) {
        const executionTime = Date.now() - startedAt

        span.recordException(e as Error)
        span.setStatus({ code: SpanStatusCode.ERROR })

        if (e instanceof Error) {
          span.setAttribute('exceptions.message', e.message)
          span.setAttribute('exception.stacktrace', e.stack ?? '')

          const prototype = Object.getPrototypeOf(e) as { constructor: { name: string } }
          const className = prototype.constructor.name as string | undefined

          span.setAttribute('exception.type', className ?? e.name)

          console.error(
            colors.blue(job.data.className),
            'failed with error:',
            colors.red(`${e.name}: ${e.message}`),
            `(${executionTime}ms)`
          )
        }

        span.addEvent('job.failed', {
          'job.execution_time': executionTime,
          'job.error': e instanceof Error ? e.message : String(e)
        })

        captureException(e)

        throw e
      } finally {
        span.end()
      }
    })

    return result
  }
}
