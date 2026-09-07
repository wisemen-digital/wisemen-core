---
name: plain-time
description: Use when working with wall-clock times without a date or timezone in APIs.
---

# PlainTime

Use `PlainTime` for local times such as opening hours, cutoff times, and shift starts. Validate DTO strings with `@IsPlainTime()` or the comparison decorators, document them with `@PlainTimeApiProperty()`, and persist them with `@PlainTimeColumn()`.

```ts
import {
  IsPlainTimeAfter,
  IsPlainTime,
  PlainTime,
  PlainTimeApiProperty,
  PlainTimeColumn,
  timestamp,
} from '@wisemen/datewise'

export class CreateWindowCommand {
  @PlainTimeApiProperty()
  @IsPlainTime()
  opensAt: string

  @PlainTimeApiProperty()
  @IsPlainTime()
  @IsPlainTimeAfter((dto: CreateWindowCommand) => dto.opensAt)
  closesAt: string
}

@Entity()
export class OpeningHours {
  @PlainTimeColumn()
  opensAt: PlainTime
}

const noon = timestamp('2026-01-01T12:00:00.000Z').toPlainTime()
const opensAt = timestamp('2026-01-01T08:30:00.000Z').toPlainTime()
const opensBeforeNoon = opensAt.isBefore(noon)
```

Use `PlainTime` only for timezone-agnostic clock time. Switch to `Timestamp` once the date or timezone matters.
