# Range Util

`DateTimeRangeUtil` contains static helpers for checking whether an instant falls within a `DateTimeInstantRange` or `DateTimeInstantRangeWithInfinity`.

## Import

```typescript
import { DateTimeRangeUtil } from '@wisemen/vue-core-dates'
```

## isInRange

Returns `true` when the instant falls within the range (inclusive).

```typescript
DateTimeRangeUtil.isInRange(instant, { from: startInstant, until: endInstant })
// true or false
```

Open-ended ranges are supported:

```typescript
DateTimeRangeUtil.isInRange(instant, { from: 'infinity', until: endInstant })
// true when instant <= endInstant

DateTimeRangeUtil.isInRange(instant, { from: startInstant, until: 'infinity' })
// true when instant >= startInstant
```

## isBeforeRange

Returns `true` when the instant is before the start of the range. Always returns `false` when the start is `'infinity'`.

```typescript
DateTimeRangeUtil.isBeforeRange(instant, range)
// true or false
```

## isAfterRange

Returns `true` when the instant is after the end of the range. Always returns `false` when the end is `'infinity'`.

```typescript
DateTimeRangeUtil.isAfterRange(instant, range)
// true or false
```

## getStateInRange

Returns `'before'`, `'in'`, or `'after'` for the instant relative to the range.

```typescript
DateTimeRangeUtil.getStateInRange(instant, range)
// 'before' | 'in' | 'after'
```
