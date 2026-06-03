# Formatting

`useDateTimeFormat` provides locale-aware formatting functions for instants, plain dates, ranges, and durations. All functions read from the active [configuration](./configuration).

## Import

```typescript
import { useDateTimeFormat } from '@wisemen/vue-core-dates'
```

## Setup

```typescript
import { useDateTimeConfig, useDateTimeFormat } from '@wisemen/vue-core-dates'

const { update } = useDateTimeConfig()
const format = useDateTimeFormat()

update({
  locale: 'en-US',
  timeZone: 'Europe/Brussels',
})
```

## toDate

Formats an instant as a date string using the active locale.

```typescript
format.toDate(instant)
// '05/26/2026'
```

## toTime

Formats an instant as a time string. Pass `true` to include seconds.

```typescript
format.toTime(instant)
// '14:30'

format.toTime(instant, true)
// '14:30:45'
```

## toDateTime

Formats an instant as a combined date and time string.

```typescript
format.toDateTime(instant)
// '05/26/2026, 14:30'

format.toDateTime(instant, true)
// '05/26/2026, 14:30:45'
```

## toDayAndMonth

Formats an instant as a zero-padded numeric day and month.

```typescript
format.toDayAndMonth(instant)
// '26/05'
```

## toNamedDayAndMonth

Formats an instant as a day with an abbreviated month name. Pass `true` to include the year.

```typescript
format.toNamedDayAndMonth(instant)
// 'May 26'

format.toNamedDayAndMonth(instant, true)
// 'May 26, 2026'
```

## toMonthAndYear

Formats an instant as a month and year.

```typescript
format.toMonthAndYear(instant)
// '05/2026'
```

## toRelativeTime

Formats an instant as a human-readable relative time from now. Differences under one minute are shown as `'now'`.

```typescript
format.toRelativeTime(pastInstant)
// '2 hours ago'

format.toRelativeTime(futureInstant)
// 'in 3 days'

format.toRelativeTime(nearInstant)
// 'now'
```

A custom reference instant can be passed as the second argument:

```typescript
format.toRelativeTime(instant, referenceInstant)
```

## toTimeRange

Formats a `DateTimeInstantRangeWithInfinity` as a readable time range string. Open-ended ranges use localized "From" and "Until" labels.

```typescript
// Both ends defined, same day
format.toTimeRange({ from: morningInstant, until: eveningInstant })
// '10:00 - 18:00'

// Both ends defined, different days
format.toTimeRange({ from: mondayInstant, until: fridayInstant })
// 'May 26, 10:00 - May 30, 18:00'

// Open start
format.toTimeRange({ from: 'infinity', until: eveningInstant })
// 'Until May 26, 18:00'

// Open end
format.toTimeRange({ from: morningInstant, until: 'infinity' })
// 'From May 26, 10:00'

// Both open
format.toTimeRange({ from: 'infinity', until: 'infinity' })
// '∞'
```

Pass `true` as the second argument to always show the date even when both ends fall on the same day:

```typescript
format.toTimeRange(range, true)
```

## rangeToDuration

Formats a `DateTimeInstantRange` as a human-readable duration string.

```typescript
format.rangeToDuration({ from: startInstant, until: endInstant })
// '2 hours 30 minutes'
```

The second argument controls unit verbosity (`'long'`, `'short'`, or `'narrow'`). Defaults to `'long'`.

```typescript
format.rangeToDuration(range, 'short')
// '2 hr. 30 min.'

format.rangeToDuration(range, 'narrow')
// '2h 30m'
```

## formatPlainDate

Formats a `PlainDate` using the active locale. Does not require a time zone.

```typescript
format.formatPlainDate(plainDate)
// '05/26/2026'
```

## formatPlainDateRange

Formats a `PlainDateRange` as a single string. Shows abbreviated month names and omits the year when both dates fall within the current year. Returns the single formatted date when start and end are identical.

```typescript
format.formatPlainDateRange({ from: plainDateA, until: plainDateB })
// 'May 26 - Jun 2'

format.formatPlainDateRange({ from: plainDate, until: plainDate })
// 'May 26'

// Null bounds are shown as '…'
format.formatPlainDateRange({ from: null, until: plainDateB })
// '… - Jun 2'
```
