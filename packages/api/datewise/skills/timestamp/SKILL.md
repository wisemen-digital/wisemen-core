---
name: timestamp
description: Use when working with absolute instants, timezone-aware datetimes, or open-ended datetime boundaries.
---

# Timestamp

Use `Timestamp` for real moments in time such as audit fields, deadlines, and scheduled execution times. Create values with `timestamp(...)`, validate DTO strings with `@IsTimestamp(...)`, document them with `@TimestampApiProperty()`, and persist them with `@TimestampColumn()`.

```ts
import {
  IsTimestamp,
  Timestamp,
  TimestampApiProperty,
  TimestampColumn,
  timestamp,
} from '@wisemen/datewise'

export class ScheduleJobCommand {
  @TimestampApiProperty()
  @IsTimestamp()
  runAt: string

  @TimestampApiProperty()
  @IsTimestamp({ isAfter: (dto: ScheduleJobCommand) => dto.runAt })
  expiresAt: string
}

@Entity()
export class Job {
  @TimestampColumn()
  runAt: Timestamp
}

const scheduledAt = timestamp('2026-01-01T09:00:00.000+01:00')
const scheduledDate = scheduledAt.toPlainDate()
```

Use `timestamp.futureInfinity()` and `timestamp.pastInfinity()` only for open-ended temporal models such as ranges.
