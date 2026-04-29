# Name Formatting

`PersonNameFormatUtil` formats full names and initials from a shared `PersonName` model.

## Import

```typescript
import { PersonNameFormatUtil } from '@wisemen/vue-core-format'
```

## toFullName

Combines first and last names while ignoring `null` and blank values.

```typescript
PersonNameFormatUtil.toFullName({
  firstName: 'John',
  lastName: 'Doe',
})
// 'John Doe'

PersonNameFormatUtil.toFullName({
  firstName: 'John',
  lastName: null,
})
// 'John'
```

## toInitials

Builds initials from the available name parts.

```typescript
PersonNameFormatUtil.toInitials({
  firstName: 'John',
  lastName: 'Doe',
})
// 'JD'

PersonNameFormatUtil.toInitials({
  firstName: 'Alice',
  lastName: null,
})
// 'A'
```
