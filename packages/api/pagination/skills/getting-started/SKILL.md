---
name: getting-started
description: Offset and Keyset pagination for NestJS applications. Use when an endpoints need a paginated response. 
---
## Import

```ts
import { PaginatedOffsetSearchQuery, PaginatedOffsetResponse, PaginatedOffsetResponseMeta, PaginatedKeysetQuery, PaginatedKeysetResponse, typeormPagination, KeysetDirection, } from '@wisemen/pagination'
```

### Keyset pagination. Use by default.

1. Define query key
```ts
export class ViewJobsIndexQueryKey {
  @ApiProperty({ type: 'string', format: 'date-time', required: false })
  @IsDateString({ strict: true })
  createdAt: string

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  id: string

  static nextKey (jobs: ViewJobsIndexJob[]): ViewJobsIndexQueryKey | null {
    if (jobs.length == 0) {
      return null
    }

    const lastItem = jobs.at(-1) as ViewJobsIndexJob

    return this.from(lastItem)
  }

  static from (job: ViewJobsIndexJob): ViewJobsIndexQueryKey {
    const key = new ViewJobsIndexQueryKey()

    key.createdAt = job.createdAt
    key.id = job.id

    return key
  }
}
```

2. Add key to pagination
```ts
export class ViewJobsIndexPaginationQuery extends PaginatedKeysetQuery {
  @ApiProperty({ type: ViewJobsIndexQueryKey, required: false, nullable: true })
  @Type(() => ViewJobsIndexQueryKey)
  @ValidateNested()
  @IsObject()
  @IsOptional()
  key?: ViewJobsIndexQueryKey | null
}
```

3. Add in response meta

```ts
class ViewJobsIndexResponseMeta implements PaginatedKeysetResponseMeta {
  @ApiProperty({ type: ViewJobsIndexQueryKey, nullable: true })
  next: ViewJobsIndexQueryKey | null

  constructor (jobs: ViewJobsIndexJob[]) {
    this.next = ViewJobsIndexQueryKey.nextKey(jobs)
  }
}
```

Typically keyset pagination can be used in combination with @wisemen/nestjs-typeorm.
The key is then typically the `lastEntity` parameter for the `findNextBatch` method on the repository.

### Offset pagination. Do not use.

```ts
// 1. Define your search query DTO
import { PaginatedOffsetSearchQuery } from '@wisemen/pagination'
import { IsString } from 'class-validator'
import { IsUndefinable } from '@wisemen/validators'

export class ViewUserIndexQuery extends PaginatedOffsetSearchQuery {
  @Equals(undefined)
  sort: never

  @Equals(undefined)
  filter: never

  @IsString()
  @IsUndefinable()
  search?: string
}

// 2. Define your response DTO
import { ApiProperty } from '@nestjs/swagger'
import { PaginatedOffsetResponse } from '@wisemen/pagination'

class ViewUserIndexItemResponse{
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: UserUuid

  @ApiProperty({ type: String})
  name: string

  constructor (user: User) {
    this.uuid = user.uuid
    this.name = user.name
  }
}

export class ViewUserIndexResponse extends PaginatedOffsetResponse<UserIndexView> {
  @ApiProperty({ type: UserIndexView, isArray: true })
  declare items: UserIndexView[]

  constructor (users: User[]) {
    const userViews = users.map(user => new UserIndexView(user))
    super(userViews, users.meta)
  }
}

`PaginatedOffsetSearchQuery` provides `pagination?: { offset, limit }` with validation and Swagger docs. `typeormPagination()` maps it to `{ skip, take }`.

