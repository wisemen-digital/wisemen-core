# Phone Formatting

`PhoneFormatUtil` masks phone numbers while preserving the original separators and spacing.

## Import

```typescript
import { PhoneFormatUtil } from '@wisemen/vue-core-format'
```

## mask

Keeps the last four digits visible and masks the preceding digits.

```typescript
PhoneFormatUtil.mask('+32 470 12 34 56')
// '+** *** ** 34 56'

PhoneFormatUtil.mask('0470 12 34 56')
// '**** ** 34 56'
```

If the input contains fewer than four digits, the original value is returned.
