# Configuration

`@wisemen/vue-core-dates` uses a shared configuration composable to control locale, time zone, and hour cycle behavior across all formatting functions.

## Import

```typescript
import { useDateTimeConfig } from '@wisemen/vue-core-dates'
```

## Set locale and time zone

Use `update` to configure the active locale and time zone. All formatting composables and utilities react to these values reactively.

```typescript
const { locale, timeZone, update } = useDateTimeConfig()

update({
  locale: 'en-US',
  timeZone: 'America/New_York',
})

console.log(locale.value)
// 'en-US'

console.log(timeZone.value)
// 'America/New_York'
```

## Set the hour cycle

The `hourCycle` option controls whether times are displayed in 12-hour or 24-hour format. When set to `'locale-default'`, the format is derived from the active locale.

```typescript
update({
  hourCycle: '24-hour',
})
```

| Value | Description |
|---|---|
| `'locale-default'` | Derived from the active locale (default) |
| `'12-hour'` | Force AM/PM format |
| `'24-hour'` | Force 24-hour format |

## Set the app language

`appLanguage` controls the language used for translated output such as relative time strings and named month labels. It is separate from `locale`, which controls number and date formatting.

```typescript
update({
  appLanguage: 'nl-BE',
  locale: 'nl-BE',
})
```

## Default behavior

If `update` is never called, the config falls back to system defaults:

- `locale` and `appLanguage` use `navigator.language` (or `Intl.DateTimeFormat().resolvedOptions().locale` outside the browser).
- `timeZone` uses `Intl.DateTimeFormat().resolvedOptions().timeZone`.
- `hourCycle` defaults to `'locale-default'`.
