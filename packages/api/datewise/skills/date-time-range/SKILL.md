---
name: date-time-range
description: Use when working with timestamp ranges, schedules, or multi-range persistence in APIs.
---

# DateTimeRange

Use `DateTimeRange` for `[from, until)` ranges bounded by `Timestamp`, such as bookings, time slots, and execution windows. In DTOs, use `DateTimeRangeDto` with `@IsDateTimeRange()`, parse with `dto.parse()`, return `DateTimeRangeResponse`, persist with `@DateTimeRangeColumn()`, query with `ContainsTimestamp(...)`, and use `DateTimeMultiRangeColumn()` when a field stores multiple ranges.

```ts
import {
  ContainsTimestamp,
  DateTimeMultiRangeColumn,
  DateTimeRange,
  DateTimeRangeColumn,
  DateTimeRangeDto,
  DateTimeRangeResponse,
  IsDateTimeRange,
  timestamp,
} from '@wisemen/datewise'

export class CreateBookingCommand {
  @IsDateTimeRange({ finiteOnly: true })
  slot: DateTimeRangeDto
}

@Entity()
export class Booking {
  @DateTimeRangeColumn({ finiteOnly: true })
  slot: DateTimeRange

  @DateTimeMultiRangeColumn({ nullable: true })
  blockedSlots: DateTimeRange[] | null
}

const slot = dto.slot.parse()
const response = DateTimeRangeResponse.from(slot)
const activeNow = ContainsTimestamp(timestamp())
```

Prefer `DateTimeRange` over separate `from` and `until` fields when overlap checks, containment, or range arithmetic are part of the model.
