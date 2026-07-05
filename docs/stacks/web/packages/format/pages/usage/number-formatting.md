# Number Formatting

`useNumberFormat` contains locale-aware helpers for displaying numeric values.

## Import

```typescript
import {
  useDataFormatConfig,
  useNumberFormat,
} from '@wisemen/vue-core-format'
```

## Setup

```typescript
const { update } = useDataFormatConfig()
const numberFormat = useNumberFormat()

update({
  locale: 'en-US',
})
```

## format

Formats a number with locale-aware grouping and decimal separators.

```typescript
numberFormat.format(1234.567)
// '1,235'

numberFormat.format(1234.567, 2)
// '1,234.57'
```

## toPercent

Formats fractional values as percentages.

```typescript
numberFormat.toPercent(0.125, 1)
// '12.5%'

numberFormat.toPercent(1)
// '100%'
```

## toCompact

Formats large numbers using compact notation.

```typescript
numberFormat.toCompact(1_200_000)
// '1.2M'
```

## toFileSize

Formats byte values into readable file sizes.

```typescript
numberFormat.toFileSize(500)
// '500 B'

numberFormat.toFileSize(1536)
// '1.5 kB'
```

## toRange

Formats a numeric range using the active locale.

```typescript
numberFormat.toRange(1000, 2000)
// '1,000 – 2,000'

numberFormat.toRange(1.5, 3.7, 1)
// '1.5 – 3.7'
```
