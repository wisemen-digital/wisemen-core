# Zod Configuration

Configure Zod schema validation with internationalized error messages.

## Basic setup

```typescript
// src/configs/zod.config.ts
import { zodConfig } from '@wisemen/vue-core-configs'
import { i18nPlugin } from '@/plugins/i18n.plugin'

export function configureZod(): void {
  zodConfig({
    i18nInstance: i18nPlugin.global,
  })
}
```

### With custom i18n instance

```typescript
zodConfig({
  i18nInstance: i18n.global,
})
```

## Internationalization

Zod error messages are automatically translated using Vue I18n. The translation keys are defined in `zod.i18n.ts` within the `@wisemen/vue-core-configs` package:

```typescript
import { getZodConfigLocales } from '@wisemen/vue-core-configs/locales'

const zodConfigLocales = getZodConfigLocales()
// Contains all Zod validation error translations
```

### Merging translations

Include Zod config locales in your i18n setup:

```typescript
const messages = {
  'en-US': {
    ...projectEnUs,
    ...getZodConfigLocales()['en-US'],  // Zod translations
  },
  'nl-BE': {
    ...projectNlBe,
    ...getZodConfigLocales()['nl-BE'],  // Zod translations
  },
}
```

For more details on internationalization and managing translations across your application, see [Vue I18n Configuration](/packages/configs/pages/guides/vue-i18n) or [i18n Factory](/packages/i18n-factory/pages/getting-started/installation).
