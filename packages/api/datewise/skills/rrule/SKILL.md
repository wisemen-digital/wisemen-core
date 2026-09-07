---
name: rrule
description: Use when modeling recurring schedules or one-off occurrences as reusable temporal rules.
---

# RRule

Use `RRule` for recurring schedules that combine a date range, timezone, start time, duration, frequency, interval, and exceptions. Create rules with `rrule(...)` or `rrule.once(...)`, persist them with `@RRuleColumn()`, and iterate occurrences with `occurrences(...)`.

```ts
import { Duration, DurationUnit } from '@wisemen/quantity'
import {
  DateTimeRange,
  RRule,
  RRuleColumn,
  RRuleFrequency,
  rrule,
  timestamp,
} from '@wisemen/datewise'

@Entity()
export class AvailabilityTemplate {
  @RRuleColumn()
  schedule: RRule
}

const start = timestamp('2026-01-01T09:00:00.000+01:00')

const schedule = rrule({
  range: new DateTimeRange('2026-01-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z'),
  timezone: 'Europe/Brussels',
  startDate: start.toPlainDate(),
  startTime: start.toPlainTime(),
  duration: new Duration(2, DurationUnit.HOURS),
  frequency: RRuleFrequency.WEEKLY,
  interval: 1,
  exceptions: [timestamp('2026-01-08T08:00:00.000Z')],
})
```

Use `rrule.once(...)` when the domain wants the same rule shape for both recurring and single occurrences.
