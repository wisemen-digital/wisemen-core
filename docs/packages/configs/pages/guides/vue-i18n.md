# Vue I18n Configuration

Pre-configured Vue I18n setup integrated with the Vue Core i18n factory for multi-language support.

## Basic setup

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import { vueI18nConfig } from '@wisemen/vue-core-configs'
import messages from './locales'

export const i18nPlugin = createI18n(
  vueI18nConfig({
    defaultLocale,
    localStorageValue,
    messages,
  }),
)
```

## Common usage with merged locales

```typescript
// src/i18n/index.ts
import { vueI18nConfig } from '@wisemen/vue-core-configs'
import { getZodConfigLocales } from '@wisemen/vue-core-configs/locales'
import { createI18n } from 'vue-i18n'

import { enUs, nlBe } from '@repo/ui/locales'
import projectEnUs from '@/locales/en-US.json'
import projectNlBe from '@/locales/nl-BE.json'

const zodConfigLocales = getZodConfigLocales()

const messages = {
  'en-US': {
    ...enUs,              // UI library locales
    ...projectEnUs,       // Project-specific locales
    ...zodConfigLocales['en-US'],  // Validation error messages
  },
  'nl-BE': {
    ...nlBe,
    ...projectNlBe,
    ...zodConfigLocales['nl-BE'],
  },
}

const defaultLocale = 'en-US'
const localStorageValue = localStorage.getItem('locale') as Locale | null

export const i18nPlugin = createI18n(
  vueI18nConfig({
    defaultLocale: localStorageValue || defaultLocale,
    localStorageValue,
    messages,
  }),
)
```

## Install in your app

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { i18nPlugin } from './i18n'

const app = createApp(App)
app.use(i18nPlugin)
app.mount('#app')
```

## Configuration Parameters

- **messages**: Object containing locale codes as keys and translation objects as values
- **defaultLocale**: Default language code (e.g., 'en-US')
- **localStorageValue**: Load saved locale preference from localStorage