# Email Formatting

`EmailFormatUtil` formats email addresses for safe display by masking the local part.

## Import

```typescript
import { EmailFormatUtil } from '@wisemen/vue-core-format'
```

## mask

Keeps the first character of the local part visible and masks the rest.

```typescript
EmailFormatUtil.mask('john@example.com')
// 'j***@example.com'

EmailFormatUtil.mask('alexander@example.com')
// 'a********@example.com'
```

If the input is not a valid email address, the original value is returned.
