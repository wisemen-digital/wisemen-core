# IBAN Formatting

`IbanFormatUtil` masks IBAN values for display while keeping the country code and final digits readable.

## Import

```typescript
import { IbanFormatUtil } from '@wisemen/vue-core-format'
```

## mask

Keeps the country code and the last four characters visible.

```typescript
IbanFormatUtil.mask('BE68 5390 0754 7034')
// 'BE** **** **** 7034'

IbanFormatUtil.mask('BE68539007547034')
// 'BE** **** **** 7034'
```

If the input is too short to mask safely, the original value is returned.
