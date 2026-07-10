# Installation

A quick guide to get started with `@wisemen/vue-core-preferences`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-preferences
```

```bash [npm]
npm install @wisemen/vue-core-preferences
```

```bash [yarn]
yarn add @wisemen/vue-core-preferences
```
:::

## Peer dependencies

This package requires the following peer dependencies:

```bash [pnpm]
pnpm install @wisemen/vue-core-design-system @wisemen/vue-core-icons @wisemen/vue-core-dates reka-ui vue vue-i18n @vueuse/core
```

## Import style

In your main CSS file, import the styles:

```css
@import '@wisemen/vue-core-preferences/style.css';
```

## Register locales

The package ships with built-in translations. Register them in your i18n setup:

```typescript
import { preferencesLocales } from '@wisemen/vue-core-preferences/locales'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  messages: {
    'en-US': {
      ...preferencesLocales['en-US'],
    },
  },
})
```

Continue with the [configuration guide](../usage/configuration) to set up your preferences dialog.
