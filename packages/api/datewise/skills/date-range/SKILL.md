---
name: date-range
description: Use when working with date-only ranges in APIs, DTOs, and TypeORM entities.
---

# DateRange

Use `DateRange` for periods bounded by `PlainDate`, such as contract validity or seasonal availability. In DTOs, use `DateRangeDto` with `@IsDateRange()`, parse with `dto.parse()`, return `DateRangeResponse` from APIs, persist with `@DateRangeColumn()`, and query with `ContainsPlainDate(...)`.

```ts
import {
  ContainsPlainDate,
  DateRange,
  DateRangeColumn,
  DateRangeDto,
  DateRangeResponse,
  IsDateRange,
  plainDate,
} from '@wisemen/datewise'

export class UpdateContractCommand {
  @IsDateRange({ finiteOnly: true })
  validity: DateRangeDto
}

@Entity()
export class Contract {
  @DateRangeColumn({ finiteOnly: true })
  validity: DateRange
}

const validity = dto.validity.parse()
const response = DateRangeResponse.from(validity)
const activeOnDate = ContainsPlainDate(plainDate.today())
```

`DateRange` normalizes boundaries to inclusive dates. Use it only when a day-level range is the right domain model.
