---
name: getting-started
description: Use when working with dates, times, timestamps, or temporal ranges in APIs.
---

# @wisemen/datewise - Getting Started

Use `@wisemen/datewise` when the domain needs typed temporal values instead of raw
`Date` objects or unstructured strings. Reach for it when working with date-only
values, wall-clock times, timezone-aware timestamps, validity periods, booking
windows, or recurring schedules.

Prefer the type that matches the domain:

- `PlainDate` for calendar dates without time or timezone
- `PlainTime` for wall-clock times without date or timezone
- `Timestamp` for absolute instants and timezone-aware datetimes
- `DateRange` for date-only periods
- `DateTimeRange` for timestamp ranges and time slots
- `RRule` for recurring or one-off schedule rules

Use the type-specific skills for concrete usage:

- `plain-date`
- `plain-time`
- `timestamp`
- `date-range`
- `date-time-range`
- `rrule`

For more detail, inspect the package README and the matching module under
`packages/api/datewise/lib/` before inventing custom temporal helpers.
