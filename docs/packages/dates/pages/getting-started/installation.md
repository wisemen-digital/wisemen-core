# Installation

A quick tutorial to get started with `@wisemen/vue-core-dates`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-dates
```

```bash [npm]
npm install @wisemen/vue-core-dates
```

```bash [yarn]
yarn add @wisemen/vue-core-dates
```
:::

## Peer dependencies

The package requires `temporal-polyfill`, `vue`, `vue-i18n`, and `zod`:

::: code-group
```bash [pnpm]
pnpm install temporal-polyfill vue vue-i18n zod
```

```bash [npm]
npm install temporal-polyfill vue vue-i18n zod
```

```bash [yarn]
yarn add temporal-polyfill vue vue-i18n zod
```
:::

## Register locales

Add the bundled translations to your `vue-i18n` instance:

```typescript
import { createI18n } from 'vue-i18n'
import { dateLocales } from '@wisemen/vue-core-dates/locales'

const i18n = createI18n({
  messages: {
    'en-US': dateLocales['en-US'],
    'nl-BE': dateLocales['nl-BE'],
  },
})
```

## Import and use

```typescript
import {
  DateTimeInstantTransformer,
  DateTimeInstantRangeTransformer,
  DateTimeRangeUtil,
  DateUtil,
  TimeZoneUtil,
  useDateTimeConfig,
  useDateTimeFormat,
} from '@wisemen/vue-core-dates'
```

## Quick example

```typescript
const { update } = useDateTimeConfig()
const format = useDateTimeFormat()

update({
  locale: 'en-US',
  timeZone: 'Europe/Brussels',
})

const now = DateUtil.getNow()

format.toDate(now)
// '05/26/2026'

format.toRelativeTime(now)
// 'now'
```

Continue with the [usage guides](../usage/configuration) for composable- and util-specific examples.
