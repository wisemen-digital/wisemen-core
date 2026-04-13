# Installation

## Package Installation

Install the i18n-factory package using your package manager:

```bash
pnpm add @wisemen/vue-core-i18n-factory
```


## Basic Setup

Once installed, you can start using the library to create your i18n factory:

```typescript
import { createI18nFactory } from '@wisemen/vue-core-i18n-factory'

const i18nFactory = createI18nFactory({
  'en-US': {
    greeting: 'Hello',
    farewell: 'Goodbye',
  },
  'nl-BE': {
    greeting: 'Hallo',
    farewell: 'Tot ziens',
  },
})

// Get all translations
const translations = i18nFactory.getTranslations()

// Access a translation
console.log(translations['en-US'].greeting) // 'Hello'
```

## Next Steps

- Learn how to [override translations](/packages/i18n-factory/pages/guide/overview) for specific locales
- Explore [package integration](/packages/i18n-factory/pages/guide/package-integration) for creating reusable i18n factories in your own packages