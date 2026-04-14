# Translations

The package exposes an i18n factory via the `/i18n` subpath export.

```typescript
import { zodValidationI18nFactory } from '@wisemen/vue-core-zod-validation/i18n'
```

## Use package defaults

```typescript
const zodValidationI18n = zodValidationI18nFactory.getTranslations()
```

## Merge package messages into your app messages

```typescript
import { Locale } from '@wisemen/vue-core-configs'
import { zodValidationI18nFactory } from '@wisemen/vue-core-zod-validation/i18n'

const zodValidationI18n = zodValidationI18nFactory.getTranslations()

const messages = {
  [Locale.EN_US]: {
    ...zodValidationI18n['en-US'],
    ...enUs,
    ...projectEnUs,
  },
  [Locale.NL_BE]: {
    ...zodValidationI18n['nl-BE'],
    ...nlBe,
    ...projectNlBe,
  },
}
```

## Override existing translations

Use `overrideDefaults` when you want to replace one or more keys in existing locales.

```typescript
const zodValidationI18n = zodValidationI18nFactory.getTranslations({
  overrideDefaults: {
    'en-US': {
      'package.zod_validation.invalid_phone_number': 'Please enter a valid phone number',
    },
  },
})
```

## Add a new locale

Use `defineExtendedLocales` to define new locales with full key autocomplete and strict key validation.

```typescript
const zodValidationI18n = zodValidationI18nFactory.getTranslations({
  extendedLocales: zodValidationI18nFactory.defineExtendedLocales({
    'fr-BE': {
      'package.zod_validation.invalid_phone_number': 'Numero de telephone invalide',
    },
  }),
})
```

For complete i18n-factory behavior (overrides, extended locales, and type-safety), see [i18n-factory overview](/packages/i18n-factory/pages/guide/overview).