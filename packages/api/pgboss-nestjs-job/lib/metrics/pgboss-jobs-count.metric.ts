import { Inject, Injectable } from '@nestjs/common'
import { type Attributes, metrics, type ObservableResult } from '@opentelemetry/api'
import { PG_BOSS_METRICS_MODULE_OPTIONS, type PgbossMetricsModuleOptions } from './pgboss-metrics.module-options.js'
import { JobState } from '../api/job-state.enum.js'

type QueueJobCount = {
  name: string
  state: string
  count: number
}

@Injectable()
export class PgbossJobsCountMetric {
  constructor (
    @Inject(PG_BOSS_METRICS_MODULE_OPTIONS)
    private readonly options: PgbossMetricsModuleOptions
  ) {
    const meter = metrics.getMeterProvider().getMeter('pg_boss_jobs')

    meter
      .createObservableGauge('pg_boss_jobs_count', {
        description: 'Tracks the number of PgBoss jobs by state and name'
      })
      .addCallback(async (observer) => { await this.observe(observer) })
  }

  private async observe (observer: ObservableResult<Attributes>): Promise<void> {
    try {
      const result = await this.options.dataSource.query<QueueJobCount[]>(`
        SELECT
          job.state,
          job.name,
          COUNT(job.id)::int as count
        FROM pgboss.job
        GROUP BY job.name, job.state
      `)

      const jobCountsByQueue: Record<string, Record<string, number>> = {}

      for (const { name, state, count } of result) {
        jobCountsByQueue[name] ??= {}
        jobCountsByQueue[name][state] = count
      }

      for (const name of this.options.queueNames) {
        const stateCounts = jobCountsByQueue[name] ?? {}

        for (const state of Object.values(JobState)) {
          observer.observe(stateCounts[state] ?? 0, { job_name: name, job_state: state })
        }
      }
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.error('Error updating pg boss job count metric:', error)
    }
  }
}
