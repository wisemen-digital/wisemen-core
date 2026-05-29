---
name: getting-started
description: >
  Add offset or keyset pagination to NestJS list endpoints using PaginatedOffsetQuery,
  PaginatedOffsetResponse, PaginatedKeysetQuery, PaginatedKeysetResponse, and the
  typeormPagination mapper.
type: lifecycle
library: pagination
exports:
  - PaginatedOffsetQuery
  - PaginatedOffsetSearchQuery
  - PaginatedOffsetResponse
  - PaginatedOffsetResponseMeta
  - PaginatedKeysetQuery
  - PaginatedKeysetSearchQuery
  - PaginatedKeysetResponse
  - KeysetDirection
  - typeormPagination
---

# @wisemen/pagination — Getting Started

Pagination DTOs and response types for NestJS APIs, supporting offset-based and keyset-based pagination with TypeORM integration.

## When to Use

- Adding paginated list endpoints to a NestJS API
- Standardizing pagination query parameters and response metadata
- Mapping pagination DTOs to TypeORM `skip`/`take` parameters

**Use instead:** Keyset pagination for large datasets or real-time feeds. Offset pagination for UIs that need page numbers.

## Import

```ts
import {
  PaginatedOffsetSearchQuery, PaginatedOffsetResponse, PaginatedOffsetResponseMeta,
  PaginatedKeysetQuery, PaginatedKeysetResponse,
  typeormPagination, KeysetDirection,
} from '@wisemen/pagination'
```

## Quick Start

### Offset pagination

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

class UserIndexView {
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

// 3. Use in your controller
import { PaginatedOffsetResponse, PaginatedOffsetResponseMeta, typeormPagination } from '@wisemen/pagination'

@Get('users')
@Version('1')
@ApiOkResponse({
  description: 'Users retrieved',
  type: ViewUserIndexResponse
})
async viewUsers(
  @Query() query: ViewUserIndexQuery
): Promise<ViewUserIndexResponse> {
  const { skip, take } = typeormPagination(query.pagination)

  const users = this.userService.findUsers({
    search: query.search,
    skip,
    take
  })

  return new ViewUserIndexResponse(users)
}
```

`PaginatedOffsetSearchQuery` provides `pagination?: { offset, limit }` with validation and Swagger docs. `typeormPagination()` maps it to `{ skip, take }`.

### Keyset pagination

```ts
import { PaginatedKeysetQuery, PaginatedKeysetResponse, KeysetDirection } from '@wisemen/pagination'

export abstract class UserKeysetQuery extends PaginatedKeysetQuery {
  @IsString()
  @IsOptional()
  key?: string | null
}

// Controller returns:
const response: PaginatedKeysetResponse = {
  items: users.map(toDto),
  meta: {
    next: lastUser?.id ?? null,
  },
}
```

## Source Files

For full API details, read the source files.

- Offset query: `lib/offset/paginated-offset.query.ts`
- Offset response: `lib/offset/paginated-offset.response.ts`
- Keyset query: `lib/keyset/paginated-keyset.query.ts`
- Keyset response: `lib/keyset/paginated-keyset.response.ts`
- Keyset direction: `lib/keyset/keyset-direction.ts`
- Pagination mapper: `lib/pagination-mapper.ts`
- Search query base: `lib/search.query.ts`
