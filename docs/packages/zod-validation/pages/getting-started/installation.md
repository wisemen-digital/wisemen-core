# Installation

`@wisemen/vue-core-zod-validation` provides reusable Zod schemas with localized error messages.

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-zod-validation
```
:::

## 2. Initialize the package config in `main.ts`

Initialize the package once during app bootstrap, and pass your Vue I18n global composer.

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { i18nPlugin } from './i18n'
import { initializeZodValidationConfig } from '@wisemen/vue-core-zod-validation'

const app = createApp(App)

app.use(i18nPlugin)

initializeZodValidationConfig({
  i18nInstance: i18nPlugin.global,
})

app.mount('#app')
```

`initializeZodValidationConfig` is required before running schemas from this package.

## 3. Use a schema

```typescript
import { z } from 'zod'
import { phoneNumberSchema } from '@wisemen/vue-core-zod-validation'

const formSchema = z.object({
  phoneNumber: phoneNumberSchema,
})
```

When validation fails, the schema returns the localized key `package.zod_validation.invalid_phone_number` through your configured i18n instance.