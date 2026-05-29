# Installation

Get `@wisemen/vue-core-filters` up and running in your project.

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-filters
```
:::

## 2. Install peer dependencies

`@wisemen/vue-core-filters` requires the following peer dependencies:

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-actions @wisemen/vue-core-dates @wisemen/vue-core-design-system pinia vue vue-i18n
```
:::

## 3. Import the stylesheet

Import the component styles in `src/tailwind/style.css`:

```typescript
import '@wisemen/vue-core-filters/style.css'
```

## 4. Register locales

Add the bundled translations to your `vue-i18n` instance:

```typescript
import { createI18n } from 'vue-i18n'
import { filtersLocales } from '@wisemen/vue-core-filters/locales'

const i18n = createI18n({
  messages: {
    'en-US': {
      ...filtersLocales['en-US'],
    },
    'nl-BE': {
      ...filtersLocales['nl-BE'],
    },
  },
})
```

## 5. You're all set!

Head over to the [Overview](../usage/overview) to learn how filters work, or jump straight to [Filter types](../usage/filter-types) for practical examples.
