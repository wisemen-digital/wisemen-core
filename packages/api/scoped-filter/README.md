# @wisemen/scoped-filter

Scope-based UUID filtering for NestJS/TypeORM applications. Provides DTO classes and TypeORM query operators for including or excluding entities by UUID with validation decorators.

## Features

- **ScopedUuidFilter DTO**: Validated filter class with include/exclude scope
- **Validation Decorator**: `@IsScopedUuidFilter` for nested validation
- **TypeORM Integration**: `MatchesScopedUuids` operator for query building
- **Query Builder Support**: Direct integration with TypeORM query builders
- **Built-in Validation**: Class validator decorators for API inputs
- **NestJS Support**: Swagger decorators for API documentation

## Installation

```bash
pnpm add @wisemen/scoped-filter
```

### Peer Dependencies

```bash
pnpm add typeorm class-validator class-transformer @nestjs/swagger
```

## Usage

### DTO

```typescript
import { ScopedUuidFilter, IsScopedUuidFilter } from '@wisemen/scoped-filter'

export class ListUsersQuery {
  @ApiProperty({type: ScopedUuidFilter})
  @IsScopedUuidFilter()
  uuid: ScopedUuidFilter<UserUuid>
}
```

Or use the manual decorators:

```typescript
import { ScopedUuidFilter } from '@wisemen/scoped-filter'
import { Type } from 'class-transformer'
import { ValidateNested, IsObject } from 'class-validator'

export class ListUsersQuery {
  @ApiProperty({type: ScopedUuidFilter})
  @Type(() => ScopedUuidFilter)
  @ValidateNested()
  @IsObject()
  uuid: ScopedUuidFilter<UserUuid>
}
```

### TypeORM

```typescript
import { MatchesScopedUuids } from '@wisemen/scoped-filter'

const entities = await repo.find({
  where: {
    uuid: MatchesScopedUuids(query.uuid)
  }
})
```
The filter includes or excludes entities based on the `scope` property:
- `INCLUDE`: Return only entities matching the provided UUIDs
- `EXCLUDE`: Return entities not matching the provided UUIDs

```typescript
import { matchesScopedUuids } from '@wisemen/scoped-filter'

const entities = await repo.createQueryBuilder()
  .where(matchesScopedUuids('user.uuid', query.uuid))
  .getMany()
```

## License

SEE LICENSE IN LICENSE.md

## Author

Wisemen