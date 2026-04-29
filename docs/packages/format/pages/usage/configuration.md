# Configuration

`@wisemen/vue-core-format` uses a shared configuration composable to control locale-aware behavior.

## Import

```typescript
import { useDataFormatConfig } from '@wisemen/vue-core-format'
```

## Set the locale

Use `update` to configure the locale for `useNumberFormat` and `useStringFormat`.

```typescript
const { locale, update } = useDataFormatConfig()

update({
  locale: 'en-US',
})

console.log(locale.value)
// 'en-US'
```

## Default behavior

If no locale is configured, the package falls back to the current runtime locale:

- In the browser, it uses `navigator.language`.
- Outside the browser, it uses `Intl.DateTimeFormat().resolvedOptions().locale`.
