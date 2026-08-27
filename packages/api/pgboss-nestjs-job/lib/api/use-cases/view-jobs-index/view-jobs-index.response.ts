import type { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import type { PaginatedKeysetResponse, PaginatedKeysetResponseMeta } from '@wisemen/pagination'
import { JobStateApiProperty } from '../../job-state.enum.js'
import type { ViewJobsIndexJob } from './view-jobs-index.job.type.js'
import { ViewJobsIndexQueryKey } from './view-jobs-index.query.js'

export interface ViewJobsIndexResponseMeta extends PaginatedKeysetResponseMeta {
  next: ViewJobsIndexQueryKey | null
}

export interface ViewJobsIndexResponse extends PaginatedKeysetResponse {
  items: ViewJobsIndexItemResponse[]
  meta: ViewJobsIndexResponseMeta
}

export interface ViewJobsIndexItemResponse {
  queueName: string
  id: string
  name: string
  status: string
  createdAt: string
  completedAt: string | null
}

export function createViewJobsIndexResponse (queueNames: string[]): Type<ViewJobsIndexResponse> {
  class DynamicViewJobsIndexItemResponse implements ViewJobsIndexItemResponse {
    @ApiProperty({ enum: queueNames, enumName: 'QueueName' })
    queueName: string

    @ApiProperty({ type: 'string', format: 'uuid' })
    id: string

    @ApiProperty({ type: 'string' })
    name: string

    @JobStateApiProperty()
    status: string

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: string

    @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
    completedAt: string | null

    constructor (job: ViewJobsIndexJob) {
      this.queueName = job.queueName
      this.id = job.id
      this.name = job.name
      this.status = job.status
      this.createdAt = job.createdAt
      this.completedAt = job.completedAt
    }
  }

  Object.defineProperty(DynamicViewJobsIndexItemResponse, 'name', {
    configurable: true,
    value: 'ViewJobsIndexItemResponse'
  })

  class DynamicViewJobsIndexResponseMeta implements ViewJobsIndexResponseMeta {
    @ApiProperty({ type: ViewJobsIndexQueryKey, nullable: true })
    next: ViewJobsIndexQueryKey | null

    constructor (jobs: ViewJobsIndexJob[]) {
      this.next = ViewJobsIndexQueryKey.nextKey(jobs)
    }
  }

  Object.defineProperty(DynamicViewJobsIndexResponseMeta, 'name', {
    configurable: true,
    value: 'ViewJobsIndexResponseMeta'
  })

  class DynamicViewJobsIndexResponse implements ViewJobsIndexResponse {
    @ApiProperty({ type: DynamicViewJobsIndexItemResponse, isArray: true })
    items: DynamicViewJobsIndexItemResponse[]

    @ApiProperty({ type: DynamicViewJobsIndexResponseMeta })
    meta: DynamicViewJobsIndexResponseMeta

    constructor (jobs: ViewJobsIndexJob[]) {
      this.items = jobs.map(job => new DynamicViewJobsIndexItemResponse(job))
      this.meta = new DynamicViewJobsIndexResponseMeta(jobs)
    }
  }

  Object.defineProperty(DynamicViewJobsIndexResponse, 'name', {
    configurable: true,
    value: 'ViewJobsIndexResponse'
  })

  return DynamicViewJobsIndexResponse
}
