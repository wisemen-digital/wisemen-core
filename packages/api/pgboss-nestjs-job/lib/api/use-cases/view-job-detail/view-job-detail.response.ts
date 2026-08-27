import { ApiProperty } from '@nestjs/swagger'
import type { Type } from '@nestjs/common'
import { JobStateApiProperty } from '../../job-state.enum.js'
import type { ViewJobDetailJob } from './view-job-detail.job.type.js'

export interface ViewJobDetailResponse {
  id: string
}

export function createViewJobDetailResponse (queueNames: string[]): Type<ViewJobDetailResponse> {
  class DynamicViewJobDetailResponse implements ViewJobDetailResponse {
    @ApiProperty({ type: 'string', format: 'uuid' })
    id: string

    @ApiProperty({ enum: queueNames, enumName: 'QueueName' })
    queueName: string

    @ApiProperty({ type: 'number' })
    priority: number

    @ApiProperty({ type: 'string' })
    name: string

    @ApiProperty({ type: Object, nullable: true })
    data: object | string | number | boolean | null

    @JobStateApiProperty()
    status: string

    @ApiProperty({ type: 'number' })
    retryLimit: number

    @ApiProperty({ type: 'number' })
    retryCount: number

    @ApiProperty({ type: 'number' })
    retryDelay: number

    @ApiProperty({ type: 'boolean' })
    retryBackoff: boolean

    @ApiProperty({ type: 'string', format: 'date-time' })
    startAfter: string

    @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
    startedAt: string | null

    @ApiProperty({ type: 'string', nullable: true })
    singletonKey: string | null

    @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
    singletonOn: string | null

    @ApiProperty({ type: Object, nullable: true })
    expireIn: object | string | number | boolean | null

    @ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: string

    @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
    completedAt: string | null

    @ApiProperty({ type: 'string', format: 'date-time' })
    keepUntil: string

    @ApiProperty({ type: Object, nullable: true })
    output: object | string | number | boolean | null

    @ApiProperty({ type: 'string', nullable: true })
    deadLetter: string | null

    @ApiProperty({ type: 'string', nullable: true })
    policy: string | null

    constructor (job: ViewJobDetailJob) {
      this.id = job.id
      this.queueName = job.queueName
      this.priority = job.priority
      this.data = job.data
      this.name = job.name
      this.status = job.status
      this.retryLimit = job.retryLimit
      this.retryCount = job.retryCount
      this.retryDelay = job.retryDelay
      this.retryBackoff = job.retryBackoff
      this.startAfter = job.startAfter
      this.startedAt = job.startedAt
      this.singletonKey = job.singletonKey
      this.singletonOn = job.singletonOn
      this.expireIn = job.expireIn
      this.createdAt = job.createdAt
      this.completedAt = job.completedAt
      this.keepUntil = job.keepUntil
      this.output = job.output
      this.deadLetter = job.deadLetter
      this.policy = job.policy
    }
  }

  Object.defineProperty(DynamicViewJobDetailResponse, 'name', {
    configurable: true,
    value: 'ViewJobDetailResponse'
  })

  return DynamicViewJobDetailResponse
}
