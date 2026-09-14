import type { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PaginatedKeysetQuery, PaginatedKeysetSearchQuery, SortDirection, SortDirectionApiProperty, SortQuery } from '@wisemen/pagination'
import { IsUndefinable } from '@wisemen/validators'
import { Type as TransformType } from 'class-transformer'
import { ArrayMinSize, Equals, IsArray, IsDateString, IsEnum, IsIn, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator'
import type { ViewJobsIndexJob } from './view-jobs-index.job.type.js'

export interface ViewJobsIndexFilterQuery {
  queueNames?: string[]
}

export interface ViewJobsIndexQuery extends PaginatedKeysetSearchQuery {
  sort?: ViewJobsIndexSortQuery[]
  filter?: ViewJobsIndexFilterQuery
  search: never
  pagination?: ViewJobsIndexPaginationQuery
}

export interface ViewJobsIndexPaginationQuery extends PaginatedKeysetQuery {
  key?: ViewJobsIndexQueryKey | null
}

export enum ViewJobsIndexSortQueryKey {
  CREATED_AT = 'createdAt'
}

export class ViewJobsIndexSortQuery extends SortQuery {
  @ApiProperty({ enum: ViewJobsIndexSortQueryKey, enumName: 'ViewJobsIndexSortQueryKey' })
  @IsEnum(ViewJobsIndexSortQueryKey)
  key: ViewJobsIndexSortQueryKey

  @SortDirectionApiProperty()
  @IsEnum(SortDirection)
  order: SortDirection
}

export class ViewJobsIndexQueryKey {
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsDateString({ strict: true })
  createdAt: string

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  id: string

  static nextKey (jobs: ViewJobsIndexJob[]): ViewJobsIndexQueryKey | null {
    if (jobs.length === 0) {
      return null
    }

    return this.from(jobs.at(-1) as ViewJobsIndexJob)
  }

  static from (job: ViewJobsIndexJob): ViewJobsIndexQueryKey {
    const key = new ViewJobsIndexQueryKey()
    key.createdAt = job.createdAt
    key.id = job.id

    return key
  }
}

export function createViewJobsIndexQuery (queueNames: string[]): Type<ViewJobsIndexQuery> {
  class DynamicViewJobsIndexFilterQuery implements ViewJobsIndexFilterQuery {
    @ApiProperty({ enum: queueNames, enumName: 'QueueName', required: false, isArray: true })
    @IsIn(queueNames, { each: true })
    @IsUndefinable()
    @IsArray()
    @ArrayMinSize(1)
    queueNames?: string[]
  }

  Object.defineProperty(DynamicViewJobsIndexFilterQuery, 'name', {
    configurable: true,
    value: 'ViewJobsIndexFilterQuery'
  })

  class DynamicViewJobsIndexPaginationQuery extends PaginatedKeysetQuery implements ViewJobsIndexPaginationQuery {
    @ApiProperty({ type: ViewJobsIndexQueryKey, required: false, nullable: true })
    @TransformType(() => ViewJobsIndexQueryKey)
    @ValidateNested()
    @IsObject()
    @IsOptional()
    key?: ViewJobsIndexQueryKey | null
  }

  Object.defineProperty(DynamicViewJobsIndexPaginationQuery, 'name', {
    configurable: true,
    value: 'ViewJobsIndexPaginationQuery'
  })

  class DynamicViewJobsIndexQuery extends PaginatedKeysetSearchQuery implements ViewJobsIndexQuery {
    @ApiProperty({ type: ViewJobsIndexSortQuery, required: false, isArray: true })
    @TransformType(() => ViewJobsIndexSortQuery)
    @ValidateNested()
    @IsObject()
    @IsUndefinable()
    sort?: ViewJobsIndexSortQuery[]

    @ApiProperty({ type: DynamicViewJobsIndexFilterQuery, required: false })
    @TransformType(() => DynamicViewJobsIndexFilterQuery)
    @ValidateNested()
    @IsObject()
    @IsUndefinable()
    filter?: DynamicViewJobsIndexFilterQuery

    @Equals(undefined)
    search: never

    @ApiProperty({ type: DynamicViewJobsIndexPaginationQuery, required: false })
    @IsUndefinable()
    @TransformType(() => DynamicViewJobsIndexPaginationQuery)
    @ValidateNested()
    @IsObject()
    pagination?: DynamicViewJobsIndexPaginationQuery
  }

  Object.defineProperty(DynamicViewJobsIndexQuery, 'name', {
    configurable: true,
    value: 'ViewJobsIndexQuery'
  })

  return DynamicViewJobsIndexQuery
}
