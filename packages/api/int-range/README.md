# @wisemen/int-range

A TypeScript package for working with integer ranges in PostgreSQL using TypeORM.

## Features

- **IntRange class**: A comprehensive class for working with integer ranges
- **TypeORM integration**: Column decorators and transformers for `int8range` and `int8multirange` types
- **Query operators**: TypeORM query operators for range operations
- **Validation**: Class validators and decorators for API endpoints
- **Command & Response DTOs**: Ready-to-use DTOs for NestJS applications
- **Safe integer validation**: Ensures all values are within JavaScript's safe integer range

## Database Prerequisites

PostgreSQL natively supports the `int8range` and `int8multirange` types, so no custom types need to be created. The package uses `int8range` (bigint) to support the full JavaScript safe integer range (±9,007,199,254,740,991).

## Installation

```bash
npm install @wisemen/int-range
```

## Usage

### Basic IntRange

```typescript
import { IntRange } from '@wisemen/int-range'

// Create a range from 1 to 10 (inclusive)
const range = new IntRange(1, 10)

console.log(range.size) // 10
console.log(range.contains(5)) // true
console.log(range.contains(15)) // false

// Supports full safe integer range
const bigRange = new IntRange(
  Number.MIN_SAFE_INTEGER,
  Number.MAX_SAFE_INTEGER
)
```

### TypeORM Integration

```typescript
import { IntRangeColumn } from '@wisemen/int-range'
import { Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
class MyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @IntRangeColumn()
  availableRange: IntRange
}
```

### Query Operators

```typescript
import { OverlapsWith, ContainsValue } from '@wisemen/int-range'

// Find entities where the range overlaps with [5, 15]
const results = await repository.find({
  where: {
    availableRange: OverlapsWith(new IntRange(5, 15))
  }
})

// Find entities where the range contains the value 10
const results = await repository.find({
  where: {
    availableRange: ContainsValue(10)
  }
})
```

### NestJS DTOs

```typescript
import { IntRangeDto, IntRangeResponse } from '@wisemen/int-range'

class MyDto {
  @IsIntRange()
  range: IntRangeDto
}

// In your controller
@Post()
create(@Body() dto: MyDto) {
  const range = dto.range.parse() // Returns IntRange instance
  // ...
}
```

## API

### IntRange Class

#### Properties
- `from: number` - Start of the range (inclusive)
- `until: number` - End of the range (inclusive)
- `size: number` - Number of integers in the range

#### Methods
- `contains(value: number): boolean` - Check if value is in range
- `overlaps(range: IntRange): boolean` - Check if ranges overlap
- `overlap(range: IntRange): IntRange` - Get overlapping range
- `diff(range: IntRange): IntRange[]` - Get non-overlapping portions
- `isSame(range: IntRange): boolean` - Check equality
- `precedes(range: IntRange): boolean` - Check if this range comes before
- `succeeds(range: IntRange): boolean` - Check if this range comes after
- `isAdjacentTo(range: IntRange): boolean` - Check if ranges are adjacent
- `merge(range: IntRange): IntRange` - Merge adjacent ranges

### TypeORM Operators

- `OverlapsWith(range: IntRange)` - Range overlaps with given range
- `ContainsValue(value: number)` - Range contains value
- `AdjacentTo(range: IntRange)` - Range is adjacent to given range
- `Precedes(range: IntRange)` - Range precedes given range
- `Succeeds(range: IntRange)` - Range succeeds given range
- `IsPrecededBy(range: IntRange)` - Range is preceded by given range
- `IsSucceededBy(range: IntRange)` - Range is succeeded by given range
- `StrictlyLeftOf(value: number)` - Range is entirely before value
- `StrictlyRightOf(value: number)` - Range is entirely after value
- `StartsAfter(value: number)` - Range starts after value
- `EndsBefore(value: number)` - Range ends before value

## License

GPL
