# Installation

Get `@wisemen/vue-core-custom-views` up and running in your project.

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-custom-views
```
:::

## 2. Install peer dependencies

`@wisemen/vue-core-custom-views` requires the following peer dependencies:

::: code-group
```bash [pnpm]
pnpm install @tanstack/vue-hotkeys @vueuse/core @vueuse/router @wisemen/vue-core-actions @wisemen/vue-core-design-system @wisemen/vue-core-icons @wisemen/vue-core-utils formango reka-ui vue
```
:::

If you want to use the built-in filter state adapter, also install:

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-filters
```
:::

## 3. Import the stylesheet

Import the component styles in your main CSS file:

```css
@import '@wisemen/vue-core-custom-views/style.css';
```

## 4. Register locales

Add the bundled translations to your `vue-i18n` instance:

```typescript
import { createI18n } from 'vue-i18n'
import { customViewsLocales } from '@wisemen/vue-core-custom-views/locales'

const i18n = createI18n({
  messages: {
    'en-US': {
      ...customViewsLocales['en-US'],
    },
    'nl-BE': {
      ...customViewsLocales['nl-BE'],
    },
  },
})
```

## 5. You're all set!

Head over to the [Overview](../usage/overview) to learn how to set up `useCustomViewManager`, or jump to [Adapters](../usage/adapters) to see how to connect filters, search, and table columns to your views.
