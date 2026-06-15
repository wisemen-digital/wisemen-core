# Transformers

Transformers convert between API DTOs (ISO strings) and the typed `DateTimeInstant` and `DateTimeInstantRange` models used throughout the application.

## Import

```typescript
import {
  DateTimeInstantTransformer,
  DateTimeInstantRangeTransformer,
} from '@wisemen/vue-core-dates'
```

---

## DateTimeInstantTransformer

Handles single instant ↔ ISO string conversion.

### fromDto

Parses an ISO string into a `DateTimeInstant`. Passing `null` returns `null`.

```typescript
DateTimeInstantTransformer.fromDto('2026-05-26T14:30:00Z')
// DateTimeInstant

DateTimeInstantTransformer.fromDto(null)
// null
```

### toDto

Serializes a `DateTimeInstant` to an ISO string. Passing `null` returns `null`.

```typescript
DateTimeInstantTransformer.toDto(instant)
// '2026-05-26T14:30:00Z'

DateTimeInstantTransformer.toDto(null)
// null
```

---

## DateTimeInstantRangeTransformer

Handles range ↔ DTO conversion with optional support for open-ended ranges.

### fromDto / toDto

Converts between `{ startDate: string, endDate: string }` and `DateTimeInstantRange`.

```typescript
const range = DateTimeInstantRangeTransformer.fromDto({
  startDate: '2026-05-26T08:00:00Z',
  endDate: '2026-05-26T17:00:00Z',
})
// { from: DateTimeInstant, until: DateTimeInstant }

DateTimeInstantRangeTransformer.toDto(range)
// { startDate: '2026-05-26T08:00:00Z', endDate: '2026-05-26T17:00:00Z' }
```

Passing `null` to either method returns `null`.

### fromDtoWithInfinity / toDtoWithInfinity

Use when both range ends can be open (`'infinity'` or `'-infinity'`).

```typescript
const range = DateTimeInstantRangeTransformer.fromDtoWithInfinity({
  startDate: '-infinity',
  endDate: '2026-12-31T23:59:59Z',
})
// { from: 'infinity', until: DateTimeInstant }

DateTimeInstantRangeTransformer.toDtoWithInfinity(range)
// { startDate: '-infinity', endDate: '2026-12-31T23:59:59Z' }
```

### fromDtoWithStartInfinity / fromDtoWithEndInfinity

Use when only one end can be open.

```typescript
// Only the start can be open
DateTimeInstantRangeTransformer.fromDtoWithStartInfinity({
  startDate: '-infinity',
  endDate: '2026-05-26T17:00:00Z',
})
// { from: 'infinity', until: DateTimeInstant }

// Only the end can be open
DateTimeInstantRangeTransformer.fromDtoWithEndInfinity({
  startDate: '2026-05-26T08:00:00Z',
  endDate: 'infinity',
})
// { from: DateTimeInstant, until: 'infinity' }
```

### fieldToDto

Converts a form field value (`{ from: { date, time }, until: { date, time } }`) to a DTO, combining date and time with the given time zone. Returns `null` when any field is `null`.

```typescript
DateTimeInstantRangeTransformer.fieldToDto(field, 'Europe/Brussels')
// { startDate: '...', endDate: '...' }
```

### fieldWithNullableStartToDto / fieldWithNullableEndToDto

Like `fieldToDto`, but serializes a `null` start as `'-infinity'` or a `null` end as `'infinity'`.

```typescript
DateTimeInstantRangeTransformer.fieldWithNullableStartToDto(field, 'Europe/Brussels')
// { startDate: '-infinity', endDate: '...' }

DateTimeInstantRangeTransformer.fieldWithNullableEndToDto(field, 'Europe/Brussels')
// { startDate: '...', endDate: 'infinity' }
```

### toField

Converts a `DateTimeInstantRange` back to a form field value in a given time zone.

```typescript
DateTimeInstantRangeTransformer.toField(range, 'Europe/Brussels')
// { from: { date: PlainDate, time: PlainTime }, until: { date: PlainDate, time: PlainTime } }
```

Passing `null` returns `null`.

### isInfinity

Type guard that returns `true` for `'infinity'` and `'-infinity'` strings.

```typescript
DateTimeInstantRangeTransformer.isInfinity('infinity')
// true

DateTimeInstantRangeTransformer.isInfinity('2026-05-26T00:00:00Z')
// false
```
