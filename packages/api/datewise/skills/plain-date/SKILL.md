---
name: plain-date
description: Use when working with calendar dates without time or timezone in APIs.
---

# PlainDate

Use `PlainDate` for date-only values such as due dates, birthdays, and validity boundaries. Create values with `plainDate(...)`, validate DTO strings with `@IsPlainDate()`, document them with `@PlainDateApiProperty()`, and persist them with `@PlainDateColumn()`.

```ts
import {
  IsPlainDate,
  PlainDate,
  PlainDateApiProperty,
  PlainDateColumn,
  plainDate,
} from '@wisemen/datewise'

export class UpdateHolidayCommand {
  @PlainDateApiProperty()
  @IsPlainDate()
  date: string
}

@Entity()
export class Holiday {
  @PlainDateColumn()
  date: PlainDate
}

const start = plainDate('2026-01-01')
const nextWeek = start.add(1, 'week')
```

Use `plainDate.today()`, `plainDate.tomorrow()`, and the infinity helpers only when the domain really needs relative or open-ended dates.
