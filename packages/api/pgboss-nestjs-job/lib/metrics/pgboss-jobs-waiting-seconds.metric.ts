import { Inject, Injectable } from '@nestjs/common'
import { type Attributes, metrics, type ObservableResult } from '@opentelemetry/api'
import { PG_BOSS_METRICS_MODULE_OPTIONS, type PgbossMetricsModuleOptions } from './pgboss-metrics.module-options.js'

type QueueWaitingSeconds = {
  name: string
  waitingSeconds: number
}

@Injectable()
export class PgbossJobsWaitingSecondsMetric {
  constructor (
    @Inject(PG_BOSS_METRICS_MODULE_OPTIONS)
    private options: PgbossMetricsModuleOptions
  ) {
    const meter = metrics.getMeterProvider().getMeter('pg_boss_jobs')

    meter
      .createObservableGauge('pg_boss_jobs_waiting_seconds', {
        description: 'Tracks the number of seconds jobs have been waiting'
      })
      .addCallback(async (observer) => { await this.observe(observer) })
  }

  private async observe (observer: ObservableResult<Attributes>): Promise<void> {
    try {
      const result = await this.options.dataSource.query<QueueWaitingSeconds[]>(`
        SELECT name, EXTRACT(EPOCH FROM (now() - MIN(start_after)))::integer as "waitingSeconds"
        FROM pgboss.job
        WHERE state = 'created' AND start_after <= now()
        GROUP BY name
      `)

      const waitingSecondsByQueue = Object.fromEntries(
        result.map(({ name, waitingSeconds }) => [name, waitingSeconds])
      )

      for (const name of this.options.queueNames) {
        observer.observe(waitingSecondsByQueue[name] ?? 0, { job_name: name })
      }
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.error('Error updating pg boss job waiting seconds metric:', error)
    }
  }
}
