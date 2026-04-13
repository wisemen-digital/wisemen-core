# @wisemen/datewise

A comprehensive TypeScript library for working with dates, times, and ranges in a type-safe and immutable way. Built on top of Day.js, it provides specialized types and utilities for temporal operations with strong TypeORM integration.

## Features

- **PlainDate**: Date-only type without time or timezone information
- **PlainTime**: Time-only type (hours, minutes, seconds, milliseconds)
- **Timestamp**: Date and time with timezone support
- **DateRange**: Inclusive/exclusive ranges between two dates
- **DateTimeRange**: Inclusive/exclusive ranges between two timestamps
- **MultiDateTimeRange**: Multiple non-overlapping datetime ranges
- **RRule**: Recurring date/time patterns
- **TypeORM Integration**: Custom column types and query operators
- **Class Validator Decorators**: Built-in validation decorators
- **NestJS Support**: DTO builders and API property decorators
- **Immutable API**: All operations return new instances

## Installation

```bash
pnpm add @wisemen/datewise
```

### Peer Dependencies

```bash
pnpm add dayjs typeorm class-validator class-transformer @nestjs/swagger
```

## Philosophy

This package embraces immutability and type safety for temporal operations. Unlike native JavaScript `Date` objects or raw Day.js instances, `datewise` provides:

1. **Separation of Concerns**: Distinct types for dates, times, and timestamps prevent mixing incompatible temporal concepts
2. **Explicit Timezone Handling**: Timestamps carry timezone information; PlainDate/PlainTime are timezone-agnostic
3. **Range Operations**: First-class support for date and datetime ranges with proper inclusivity handling
4. **Database Integration**: Seamless TypeORM integration with custom column types and query operators
5. **Infinity Support**: Special handling for past/future infinity dates for unbounded ranges

## Core Types

### PlainDate

A date without time or timezone information (e.g., "2025-01-15").

```typescript
// Create from various inputs
const date1 = plainDate('2025-01-15')
const date2 = plainDate(new Date())
const date3 = plainDate({ year: 2025, month: Month.JANUARY, day: 15 })

// Operations (immutable)
const tomorrow = date1.add(1, 'day')
const lastMonth = date1.subtract(1, 'month')
const startOfYear = date1.startOf('year')

// Comparisons
date1.isSame(date2) // boolean
date1.isAfter(date2) // boolean
date1.isBefore(date2) // boolean
date1.isToday() // boolean

// Access components
date1.year() // 2025
date1.month() // Month enum
date1.dayOfMonth() // 15

// Formatting
date1.format('YYYY-MM-DD') // "2025-01-15"
date1.toString() // "2025-01-15"
```

### PlainTime

Time without date or timezone (e.g., "14:30:00").

```typescript
// Create from various inputs
const time1 = plainTime('14:30:00')
const time2 = plainTime('14:30:00.500') // with milliseconds
const time3 = plainTime({ hours: 14, minutes: 30, seconds: 0, milliseconds: 0 })
const time4 = plainTime(new Date()) // extracts time component

// Operations
const later = time1.add(30, 'minutes')
const earlier = time1.subtract(1, 'hour')

// Comparisons
time1.isSame(time2) // boolean
time1.isAfter(time2) // boolean
time1.isBefore(time2) // boolean

// Access components (methods, not properties)
time1.hours() // 14
time1.minutes() // 30
time1.seconds() // 0
time1.milliseconds() // 0

// Formatting
time1.format('HH:mm:ss') // "14:30:00"
```

### Timestamp

Date and time with timezone support.

```typescript
// Create
const now = timestamp()
const ts1 = timestamp('2025-01-15T14:30:00Z')
const ts2 = timestamp(new Date())

// Operations
const later = ts1.add(2, 'hours')
const earlier = ts1.subtract(1, 'day')

// Timezone conversion
const utc = ts1.setTimezone('UTC')
const local = ts1.setTimezone('Europe/Brussels')

// Extract components
const date = ts1.toPlainDate()
const time = ts1.toPlainTime()

// Comparisons
ts1.isBefore(ts2) // boolean
ts1.isAfter(ts2) // boolean
ts1.isSame(ts2, 'day') // boolean
```

### DateRange

Inclusive or exclusive range between two dates.

```typescript
// Create ranges
const range1 = new DateRange('2025-01-01', '2025-01-31') // [inclusive, inclusive]
const range2 = new DateRange('2025-01-01', '2025-02-01', '[)') // [inclusive, exclusive)
const range3 = new DateRange('2025-01-01', '2025-12-31', '()') // (exclusive, exclusive)

// Range properties (getters)
range1.days // number of days
range1.weeks // number of weeks
range1.months // number of months
range1.quarters // number of quarters
range1.years // number of years

// Check containment
range1.contains('2025-01-15') // true
range1.contains('2025-02-01') // false

// Range operations
range1.overlaps(range2) // boolean - check if ranges overlap
range1.overlap(range2) // returns overlapping DateRange (throws if no overlap)
range1.diff(range2) // returns array of non-overlapping portions
```

### DateTimeRange

Inclusive or exclusive range between two timestamps.

```typescript
// Create (default: [inclusive, exclusive))
const range1 = new DateTimeRange('2025-01-01T00:00:00Z', '2025-01-02T00:00:00Z')
const range2 = new DateTimeRange('2025-01-01', '2025-01-02', '[]') // fully inclusive
const range3 = new DateTimeRange('2025-01-01', '2025-01-02', '()') // fully exclusive

// Properties (getters)
range1.years // whole years
range1.months // whole months
range1.weeks // whole weeks
range1.days // whole days
range1.hours // whole hours
range1.minutes // whole minutes
range1.seconds // whole seconds
range1.milliseconds // whole milliseconds

// Operations
range1.contains(timestamp('2025-01-01T12:00:00Z')) // boolean
range1.overlaps(range2) // boolean
range1.overlap(range2) // returns overlapping DateTimeRange (throws if no overlap)
range1.diff(range2) // returns MultiDateTimeRange of non-overlapping portions
```

## TypeORM Integration

### Column Types

```typescript
@Entity()
class Event {
  @PlainDateColumn()
  eventDate: PlainDate

  @PlainTimeColumn()
  startTime: PlainTime

  @TimestampColumn()
  createdAt: Timestamp

  @DateRangeColumn()
  validityPeriod: DateRange
}
```

### Query Operators

```typescript
// Find events overlapping with a date range
const events = await repository.find({
  where: {
    validityPeriod: overlapsWithDateRange(new DateRange('2025-01-01', '2025-12-31'))
  }
})

// Find events on a specific date
const todayEvents = await repository.find({
  where: {
    validityPeriod: containsPlainDate(plainDate())
  }
})
```

## Validation

```typescript
class CreateEventDto {
  @IsPlainDate()
  eventDate: PlainDate

  @IsPlainTime()
  startTime: PlainTime

  @IsTimestamp()
  createdAt: Timestamp

  @IsDateRange()
  validityPeriod: DateRange
}
```

### Timestamp Validation with Comparisons

The `@IsTimestamp()` decorator supports additional validation options to compare timestamps:

```typescript
class BookingDto {
  @IsTimestamp()
  checkInTime: string

  // Validate that checkOutTime is after checkInTime
  @IsTimestamp({
    isAfter: (dto) => (dto as BookingDto).checkInTime
  })
  checkOutTime: string
}

class ScheduleDto {
  @IsTimestamp()
  deadline: string

  // Validate that submissionTime is before deadline
  @IsTimestamp({
    isBefore: (dto) => (dto as ScheduleDto).deadline
  })
  submissionTime: string
}

class TimeRangeDto {
  @IsTimestamp()
  minTime: string

  // Validate that time is same or after minTime
  @IsTimestamp({
    isSameOrAfter: (dto) => (dto as TimeRangeDto).minTime
  })
  time: string
}

class AppointmentDto {
  @IsTimestamp()
  maxTime: string

  // Validate that appointmentTime is same or before maxTime
  @IsTimestamp({
    isSameOrBefore: (dto) => (dto as AppointmentDto).maxTime
  })
  appointmentTime: string
}

// Multiple constraints can be combined
class EventDto {
  @IsTimestamp()
  startTime: string

  @IsTimestamp()
  endTime: string

  // Validate that eventTime is after startTime AND before endTime
  @IsTimestamp({
    isAfter: (dto) => (dto as EventDto).startTime,
    isBefore: (dto) => (dto as EventDto).endTime
  })
  eventTime: string
}
```

Available comparison options:
- `isAfter`: Validates the timestamp is strictly after the comparison value
- `isBefore`: Validates the timestamp is strictly before the comparison value
- `isSameOrAfter`: Validates the timestamp is the same as or after the comparison value
- `isSameOrBefore`: Validates the timestamp is the same as or before the comparison value

Note: If the comparison callback returns `null` or `undefined`, the comparison validation is skipped.

## NestJS Integration

```typescript
// DTO with ApiProperty decorators
class EventFilterDto {
  @ApiProperty({type: DateRangeDto})
  @IsDateRange()
  dateRange: DateRangeDto
}

// Command builder for input
class CreateEventCommand {
  @ApiProperty({type: DateTimeRangeDto})
  @IsDateTimeRange()
  timeRange: DateTimeRangeDto
}
```

## Advanced Features

### Infinity Dates

```typescript
import { futureInfinityDate, pastInfinityDate } from '@wisemen/datewise'

const unboundedRange = new DateRange(pastInfinityDate(), futureInfinityDate())
unboundedRange.contains(plainDate()) // always true
```

### RRule (Recurring Dates)

```typescript

const rrule = rrule({
  frequency: Frequency.WEEKLY,
  interval: 2,
  ...
})

// Store in database with TypeORM
@Entity()
class RecurringEvent {
  @RRuleColumn()
  schedule: RRule
}
```

## API Reference

For detailed API documentation, see the TypeScript interfaces:
- `PlainDate` - Date-only operations
- `PlainTime` - Time-only operations  
- `Timestamp` - Full datetime with timezone
- `DateRange` - Date range operations
- `DateTimeRange` - Datetime range operations
- `MultiDateTimeRange` - Multiple ranges
- `RRule` - Recurring patterns

## License

GPL

## Author

Wisemen