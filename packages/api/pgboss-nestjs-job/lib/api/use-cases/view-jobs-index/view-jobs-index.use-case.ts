import { Inject, Injectable } from '@nestjs/common'
import { readonly } from '@wisemen/nestjs-typeorm'
import { SortDirection } from '@wisemen/pagination'
import type { SelectQueryBuilder } from 'typeorm'
import { JOBS_DEFAULT_LIMIT, JOBS_API_MODULE_OPTIONS } from '../../jobs-api.constants.js'
import type { ResolvedJobsApiModuleOptions } from '../../jobs-api-options.module.js'
import type { ViewJobsIndexJob } from './view-jobs-index.job.type.js'
import type { ViewJobsIndexQuery } from './view-jobs-index.query.js'

@Injectable()
export class ViewJobsIndexUseCase {
  constructor (
    @Inject(JOBS_API_MODULE_OPTIONS)
    private options: ResolvedJobsApiModuleOptions
  ) {}

  async execute (query: ViewJobsIndexQuery): Promise<ViewJobsIndexJob[]> {
    const jobs = await readonly(this.options.dataSource, async manager => {
      const queryBuilder = manager.createQueryBuilder()
        .select([
          'name AS "queueName"',
          'id',
          'data->>\'className\' AS "name"',
          'state AS "status"',
          'created_on AS "createdAt"',
          'completed_on AS "completedAt"'
        ])
        .from('pgboss.job', 'job')
        .where('name IN (:...names)', { names: query.filter?.queueNames ?? this.options.queueNames })
        .orderBy('created_on', this.getSortDirection(query))
        .addOrderBy('id', this.getSortDirection(query))
        .limit(query.pagination?.limit ?? JOBS_DEFAULT_LIMIT)

      this.addWhereForKeyset(query, queryBuilder)

      return await queryBuilder.getRawMany<ViewJobsIndexJob>()
    })

    return jobs
  }

  private addWhereForKeyset (
    query: ViewJobsIndexQuery,
    queryBuilder: SelectQueryBuilder<object>
  ): void {
    if (query.pagination?.key == null) {
      return
    }

    const operator = this.getSortDirection(query) === 'ASC' ? '>' : '<'
    const { createdAt, id } = query.pagination.key
    queryBuilder.andWhere(`(created_on, id) ${operator} (:createdAt, :id)`, { createdAt, id })
  }

  private getSortDirection (query: ViewJobsIndexQuery): 'ASC' | 'DESC' {
    return query.sort?.at(0)?.order === SortDirection.ASC ? 'ASC' : 'DESC'
  }
}
