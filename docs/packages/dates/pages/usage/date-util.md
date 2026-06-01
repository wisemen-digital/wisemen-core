# Date Util

`DateUtil` contains static helpers for creating, converting, and comparing `DateTimeInstant` values.

## Import

```typescript
import { DateUtil } from '@wisemen/vue-core-dates'
```

## getNow

Returns the current instant.

```typescript
const now = DateUtil.getNow()
```

## instantFrom

Parses an ISO 8601 string into a `DateTimeInstant`.

```typescript
const instant = DateUtil.instantFrom('2026-05-26T14:30:00Z')
```

## instantFromDateAndTime

Combines a `PlainDate`, `PlainTime`, and IANA time zone into a `DateTimeInstant`.

```typescript
const instant = DateUtil.instantFromDateAndTime(plainDate, plainTime, 'Europe/Brussels')
```

## instantToPlainDate

Extracts the date portion of an instant in a given time zone.

```typescript
const date = DateUtil.instantToPlainDate(instant, 'Europe/Brussels')
// Temporal.PlainDate
```

## instantToPlainTime

Extracts the time portion of an instant in a given time zone.

```typescript
const time = DateUtil.instantToPlainTime(instant, 'Europe/Brussels')
// Temporal.PlainTime
```

## instantToZonedDateTime

Converts an instant to a `Temporal.ZonedDateTime` in a given time zone.

```typescript
const zdt = DateUtil.instantToZonedDateTime(instant, 'Europe/Brussels')
```

## isAfter / isBefore / isEqual

Compares two instants.

```typescript
DateUtil.isAfter(laterInstant, earlierInstant)
// true

DateUtil.isBefore(earlierInstant, laterInstant)
// true

DateUtil.isEqual(instantA, instantA)
// true
```

## earliest / latest

Returns the earliest or latest from a list of instants.

```typescript
DateUtil.earliest(instantA, instantB, instantC)
// the instant with the smallest epoch milliseconds

DateUtil.latest(instantA, instantB, instantC)
// the instant with the largest epoch milliseconds
```

## plainDateToInstant

Converts a `PlainDate` to a `DateTimeInstant` at the start of that day in the given time zone.

```typescript
const instant = DateUtil.plainDateToInstant(plainDate, 'Europe/Brussels')
```

## plainDateRangeToDateTimeInstantRange

Converts a `PlainDateRange` to a `DateTimeInstantRange`. The start instant is set to the beginning of the start day and the end instant is set to 23:59:59.999 of the end day. Returns `null` when either bound is `null`.

```typescript
const range = DateUtil.plainDateRangeToDateTimeInstantRange({
  from: plainDateA,
  until: plainDateB,
})
// { from: DateTimeInstant, until: DateTimeInstant }

DateUtil.plainDateRangeToDateTimeInstantRange({ from: null, until: plainDateB })
// null
```

## plainDateTimeFromDateAndTime

Combines a `PlainDate` and `PlainTime` into a `Temporal.PlainDateTime` without attaching a time zone.

```typescript
const plainDateTime = DateUtil.plainDateTimeFromDateAndTime(plainDate, plainTime)
```
