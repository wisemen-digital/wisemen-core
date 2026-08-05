# Number Util

`NumberUtil` provides reusable number calculations and formatting helpers.

## Import

```typescript
import { NumberUtil } from '@wisemen/vue-core-utils'
```

## average

Calculates the arithmetic mean of an array.

```typescript
NumberUtil.average([1, 2, 3, 4])
// 2.5

NumberUtil.average([])
// 0
```

## clamp

Clamps a number to a min/max range.

```typescript
NumberUtil.clamp(15, 0, 10)
// 10
```

## percentage

Calculates the percentage of `value` relative to `total`.

```typescript
NumberUtil.percentage(25, 200)
// 12.5

NumberUtil.percentage(1, 0)
// 0
```

## round

Rounds to a specified number of decimals.

```typescript
NumberUtil.round(3.14159, 2)
// 3.14

NumberUtil.round(1.005, 2)
// 1.01
```

## sum

Sums all values in an array.

```typescript
NumberUtil.sum([1, 2, 3, 4])
// 10
```