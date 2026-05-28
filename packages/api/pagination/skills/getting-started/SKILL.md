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
import { IsOptional, IsString } from 'class-validator'

export class UserSearchQuery extends PaginatedOffsetSearchQuery {
  @IsOptional()
  @IsString()
  search?: string

  sort?: undefined
  filter?: undefined
}

// 2. Use in controller
import { PaginatedOffsetResponse, PaginatedOffsetResponseMeta, typeormPagination } from '@wisemen/pagination'

@Get()
async list(@Query() query: UserSearchQuery): Promise<PaginatedOffsetResponse<UserDto>> {
  const { skip, take } = typeormPagination(query.pagination)

  const [users, total] = await this.userRepo.findAndCount({
    skip,
    take,
    where: query.search ? { name: ILike(`%${query.search}%`) } : {},
  })

  return new PaginatedOffsetResponse(
    users.map(toDto),
    new PaginatedOffsetResponseMeta(total, skip, take),
  )
}
```

`PaginatedOffsetSearchQuery` provides `pagination?: { offset, limit }` with validation and Swagger docs. `typeormPagination()` maps it to `{ skip, take }`.

### Keyset pagination

```ts
import { PaginatedKeysetQuery, PaginatedKeysetResponse, KeysetDirection } from '@wisemen/pagination'

export abstract class UserKeysetQuery extends PaginatedKeysetQuery {
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
