import { Inject, Injectable } from '@nestjs/common'
import { readonly } from '@wisemen/nestjs-typeorm'
import { JOBS_API_MODULE_OPTIONS } from '../../jobs-api.constants.js'
import type { ResolvedJobsApiModuleOptions } from '../../jobs-api-options.module.js'
import { JobNotFoundError } from './job-not-found.api-error.js'
import type { ViewJobDetailJob } from './view-job-detail.job.type.js'

@Injectable()
export class ViewJobDetailUseCase {
  constructor (
    @Inject(JOBS_API_MODULE_OPTIONS)
    private options: ResolvedJobsApiModuleOptions
  ) {}

  async execute (jobId: string): Promise<ViewJobDetailJob> {
    const job = await readonly(this.options.dataSource, async manager =>
      await manager.createQueryBuilder()
        .select([
          'id',
          'name as "queueName"',
          'priority',
          'data->>\'className\' AS "name"',
          'data->>\'classData\' AS "data"',
          'state AS "status"',
          'retry_limit AS "retryLimit"',
          'retry_count AS "retryCount"',
          'retry_delay AS "retryDelay"',
          'retry_backoff AS "retryBackoff"',
          'start_after AS "startAfter"',
          'started_on AS "startedAt"',
          'singleton_key AS "singletonKey"',
          'singleton_on AS "singletonOn"',
          'expire_seconds AS "expireIn"',
          'created_on AS "createdAt"',
          'completed_on AS "completedAt"',
          'keep_until AS "keepUntil"',
          'output',
          'dead_letter AS "deadLetter"',
          'policy'
        ])
        .from('pgboss.job', 'job')
        .where('job.id = :jobId', { jobId })
        .getRawOne<ViewJobDetailJob>()
    )

    if (job === undefined) {
      throw new JobNotFoundError()
    }

    return job
  }
}
