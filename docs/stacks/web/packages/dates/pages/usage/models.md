# Models

All types exported by `@wisemen/vue-core-dates` are listed here, grouped by concern. Import any of them directly from the package:

```typescript
import type {
  DateTimeInstant,
  DateTimeInstantRange,
  PlainDate,
  TimeZone,
} from '@wisemen/vue-core-dates'
```

---

## Instant types

These types represent points in time or time ranges anchored to the UTC timeline. They are timezone-independent and are the primary types to use when working with API data.

### `DateTimeInstant`

An alias for `Temporal.Instant`. Represents a single, unambiguous point in time — a nanosecond-precise timestamp on the UTC timeline.

```typescript
type DateTimeInstant = Temporal.Instant
```

Use this for any timestamp that needs to be stored, compared, or converted across time zones. Almost every utility and transformer in this package works with `DateTimeInstant` as its fundamental unit.

```typescript
const now: DateTimeInstant = DateUtil.getNow()
const parsed: DateTimeInstant = DateUtil.instantFrom('2026-05-26T14:30:00Z')
```

---

### `DateTimeInstantWithInfinity`

A `DateTimeInstant` or the string `'infinity'`. Used as a range bound when one end of a range may be open-ended.

```typescript
type DateTimeInstantWithInfinity = 'infinity' | DateTimeInstant
```

Use this as a field type within the range interfaces below. You will not typically construct this directly — use the transformer methods that return it.

---

## Range types

Use these to represent a span of time between two instants. Pick the variant that matches how open-ended the range is allowed to be.

### `DateTimeInstantRange`

A closed range between two instants. Both bounds are required.

```typescript
interface DateTimeInstantRange {
  from: DateTimeInstant
  until: DateTimeInstant
}
```

Use this when both a start and an end are always present — for example, a completed time slot, a booking, or a scheduled task with a fixed duration.

```typescript
const range: DateTimeInstantRange = {
  from: DateUtil.instantFrom('2026-05-26T08:00:00Z'),
  until: DateUtil.instantFrom('2026-05-26T17:00:00Z'),
}
```

---

### `DateTimeInstantRangeWithEndInfinity`

A range where the start is always defined but the end may be open (`'infinity'`).

```typescript
interface DateTimeInstantRangeWithEndInfinity {
  from: DateTimeInstant
  until: DateTimeInstantWithInfinity
}
```

Use this for things that have started but may not have ended — an ongoing subscription, an active contract, or a membership with no expiry date.

---

### `DateTimeInstantRangeWithStartInfinity`

A range where the end is always defined but the start may be open (`'infinity'`).

```typescript
interface DateTimeInstantRangeWithStartInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstant
}
```

Use this for deadlines or cut-off dates where there is no meaningful start — "everything up until this date".

---

### `DateTimeInstantRangeWithInfinity`

A range where either or both bounds may be open (`'infinity'`).

```typescript
interface DateTimeInstantRangeWithInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstantWithInfinity
}
```

Use this when you need maximum flexibility — for example, displaying a timeline that may be unbounded on one or both ends. This is the type accepted by `toTimeRange` and `DateTimeRangeUtil`.

---

## Plain date and time types

These types represent calendar dates and clock times **without** a time zone. They are not points on the UTC timeline and cannot be compared across time zones directly.

### `PlainDate`

An alias for `Temporal.PlainDate`. Represents a calendar date: a year, month, and day with no time or zone.

```typescript
type PlainDate = Temporal.PlainDate
```

Use this for things where the time of day is irrelevant — birthdays, public holidays, contract start dates, or any date that should display the same value regardless of the user's time zone.

```typescript
const today: PlainDate = Temporal.Now.plainDateISO()
```

---

### `PlainDateRange`

A pair of nullable `PlainDate` bounds. Either bound can be `null` to represent an open range in a UI context (e.g., a date picker where the user has not yet selected both ends).

```typescript
interface PlainDateRange {
  from: PlainDate | null
  until: PlainDate | null
}
```

Use this as the value type for date range pickers. Convert to a `DateTimeInstantRange` with `DateUtil.plainDateRangeToDateTimeInstantRange` when you need to send it to an API.

---

### `PlainTime`

An alias for `Temporal.PlainTime`. Represents a time of day — hours, minutes, seconds, and optional sub-seconds — with no date or zone.

```typescript
type PlainTime = Temporal.PlainTime
```

Use this for recurring times like opening hours, alarm times, or slot durations where the calendar date is irrelevant.

```typescript
const openingTime: PlainTime = Temporal.PlainTime.from('09:00')
```

---

### `Duration`

An alias for `Temporal.Duration`. Represents a length of time such as "2 hours" or "3 days".

```typescript
type Duration = Temporal.Duration
```

Use this when you need to do arithmetic on time spans. Create one from `Temporal.Duration.from(...)` and pass it to `Temporal` arithmetic methods.

---

## Configuration types

These types control how dates are displayed and formatted.

### `TimeZone`

An IANA time zone identifier string such as `'Europe/Brussels'` or `'America/New_York'`.

```typescript
type TimeZone = string
```

Used everywhere a time zone context is required to convert between `DateTimeInstant` and `PlainDate`/`PlainTime`.

---

### `Locale`

A BCP 47 locale tag string such as `'en-US'` or `'nl-BE'`.

```typescript
type Locale = string
```

Controls number and date formatting in `Intl.*` APIs. Set via `useDateTimeConfig`.

---

### `HourCycle`

Controls whether times are displayed in 12-hour or 24-hour format.

```typescript
type HourCycle = '12-hour' | '24-hour' | 'locale-default'
```

| Value | Description |
|---|---|
| `'locale-default'` | Derived from the active locale (default) |
| `'12-hour'` | Force AM/PM display |
| `'24-hour'` | Force 24-hour display |

Set via `useDateTimeConfig`. See the [Configuration](./configuration) page for details.

---

## Form field types

These types are intended for use with form libraries (e.g., `vee-validate`) paired with the Zod schemas below. They represent the raw, potentially incomplete values held in a form before they are transformed into API-ready instants.

### `DateAndTime`

A pair of `PlainDate` and `PlainTime`. The building block for all form range fields.

```typescript
interface DateAndTime {
  date: PlainDate
  time: PlainTime
}
```

---

### `DateTimeInstantRangeField`

A fully required form range: both start and end must have a date and time. Zod validation ensures the end is after the start.

```typescript
interface DateTimeInstantRangeField {
  from: DateAndTime
  until: DateAndTime
}
```

Use this as your form value type for time range inputs where both bounds are always required. Convert to a `DateTimeInstantRange` via `DateTimeInstantRangeTransformer.toField` / `.fieldToDto`.

---

### `NullableDateTimeInstantRangeField`

Like `DateTimeInstantRangeField` but both bounds can be `null`. Either both `date` and `time` are set, or both are `null` — mixed states are rejected by the schema.

```typescript
interface NullableDateTimeInstantRangeField {
  from: { date: PlainDate | null; time: PlainTime | null }
  until: { date: PlainDate | null; time: PlainTime | null }
}
```

Use this for optional range inputs where the user may leave either bound empty.

---

### `DateTimeInstantRangeWithNullableStartField`

The start bound is nullable (representing an open start); the end is always required.

```typescript
interface DateTimeInstantRangeWithNullableStartField {
  from: { date: PlainDate | null; time: PlainTime | null }
  until: DateAndTime
}
```

Use this when editing a range that may start at `-infinity` — for example, a tariff that applies "from the beginning of time until a specific date". Serialize with `DateTimeInstantRangeTransformer.fieldWithNullableStartToDto`.

---

### `DateTimeInstantRangeWithNullableEndField`

The end bound is nullable (representing an open end); the start is always required.

```typescript
interface DateTimeInstantRangeWithNullableEndField {
  from: DateAndTime
  until: { date: PlainDate | null; time: PlainTime | null }
}
```

Use this when editing a range that may have no end date — for example, an active contract or an ongoing subscription. Serialize with `DateTimeInstantRangeTransformer.fieldWithNullableEndToDto`.

---

### `PlainDateField`

A Zod-validated `Temporal.PlainDate`. Identical to `PlainDate` at runtime — the schema is used to validate form inputs.

```typescript
type PlainDateField = Temporal.PlainDate
```

---

### `PlainTimeField`

A Zod-validated `Temporal.PlainTime`. Identical to `PlainTime` at runtime — the schema is used to validate form inputs.

```typescript
type PlainTimeField = Temporal.PlainTime
```

---

## Zod schemas

Use these schemas to define and validate form values with `zod`. Each schema corresponds to one of the form field types above.

| Schema | Validates |
|---|---|
| `plainDateFieldSchema` | `PlainDateField` |
| `plainTimeFieldSchema` | `PlainTimeField` |
| `dateAndTimeSchema` | `DateAndTime` |
| `nullableDateAndTimeSchema` | `{ date: PlainDate \| null, time: PlainTime \| null }` with consistency check |
| `dateTimeInstantRangeFieldSchema` | `DateTimeInstantRangeField` — end must be after start |
| `nullableDateTimeInstantRangeFieldSchema` | `NullableDateTimeInstantRangeField` — end must be after start when both are filled |
| `dateTimeInstantRangeWithNullableStartField` | `DateTimeInstantRangeWithNullableStartField` |
| `dateTimeInstantRangeWithNullableEndField` | `DateTimeInstantRangeWithNullableEndField` |

```typescript
import { dateTimeInstantRangeFieldSchema } from '@wisemen/vue-core-dates'

const schema = z.object({
  period: dateTimeInstantRangeFieldSchema,
})
```
