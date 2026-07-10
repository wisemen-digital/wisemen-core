# @wisemen/scoped-filter

Reusable NestJS/TypeORM filter DTOs with built-in validation and query helpers.

## Installation

```bash
pnpm add @wisemen/scoped-filter
```

### Peer Dependencies

```bash
pnpm add typeorm class-validator class-transformer @nestjs/swagger
```

## Available Filters

### Scoped inclusion filters

Use `ScopedUuidFilter` or `buildScopedEnumFilter(...)` when the query should include or exclude a list of values.

```typescript
import { ApiProperty } from '@nestjs/swagger'
import { IsScopedUuidFilter, ScopedUuidFilter } from '@wisemen/scoped-filter'

export class ListUsersQuery {
  @ApiProperty({ type: ScopedUuidFilter })
  @IsScopedUuidFilter()
  uuid: ScopedUuidFilter<UserUuid>
}
```

### Conditional filters

Use `IsFilter(...)` for nested validation with the new single-value filters:

- `NumberFilter`
- `TimestampFilter`
- `PlainDateFilter`
- `DateTimeRangeFilter`
- `DateRangeFilter`

```typescript
import { ApiProperty } from '@nestjs/swagger'
import {
  IsFilter,
  NumberFilter,
  TimestampFilter,
} from '@wisemen/scoped-filter'

export class ListInvoicesQuery {
  @ApiProperty({ type: NumberFilter })
  @IsFilter(NumberFilter)
  amount?: NumberFilter

  @ApiProperty({ type: TimestampFilter })
  @IsFilter(TimestampFilter)
  createdAt?: TimestampFilter
}
```

## Conditions

- `NumberFilterCondition`: `equal`, `notEqual`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`
- `DateFilterCondition`: `equal`, `notEqual`, `before`, `after`
- `RangeFilterCondition`: `overlaps`, `doesNotOverlap`, `contains`, `doesNotContain`

## TypeORM

Repository helpers:

```typescript
import {
  Matches,
  MatchesNumber,
  MatchesTimestamp,
} from '@wisemen/scoped-filter'

const entities = await repo.find({
  where: {
    uuid: Matches(query.uuid),
    amount: MatchesNumber(query.amount),
    createdAt: MatchesTimestamp(query.createdAt),
  },
})
```

Query builder helpers:

```typescript
import {
  matches,
  matchesNumber,
  matchesTimestamp,
} from '@wisemen/scoped-filter'

const entities = await repo.createQueryBuilder('invoice')
  .where(matches('invoice.uuid', query.uuid))
  .andWhere(matchesNumber('invoice.amount', query.amount))
  .andWhere(matchesTimestamp('invoice.createdAt', query.createdAt))
  .getMany()
```

## License

SEE LICENSE IN LICENSE.md
