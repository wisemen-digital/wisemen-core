# Overview

The i18n-factory is a TypeScript library that provides a type-safe way to manage internationalization (i18n) with flexible locale management and strict key validation.

## Core Concepts

### Default Locales

When you create an i18n factory, you define default locales with their translations. These serve as the foundation for your internationalization setup:

```typescript
const i18nFactory = createI18nFactory({
  'en-US': {
    key1: 'Value 1',
    key2: 'Value 2',
  },
  'nl-BE': {
    key1: 'Waarde 1',
    key2: 'Waarde 2',
  },
})
```

### Partial Overrides

You can override specific keys in default locales without providing all keys. The remaining keys are inherited from the defaults:

```typescript
const overridden = i18nFactory.getTranslations({
  overrideDefaults: {
    'en-US': {
      key1: 'Custom Value 1',
      // key2 will still be 'Value 2'
    },
  },
})
```

### Extended Locales

Add new locales by providing **all required keys**. TypeScript will enforce that every key from the default locales is defined:

```typescript
const extended = i18nFactory.getTranslations({
  extendedLocales: {
    'es-ES': {
      key1: 'Valor 1',
      key2: 'Valor 2',
      // TypeScript error if any key is missing
    },
  },
})
```

### Type Safety

All keys are validated at compile time. Attempting to use a key that doesn't exist in the default locales will result in a TypeScript error:

```typescript
const result = i18nFactory.getTranslations({
  overrideDefaults: {
    'en-US': {
      key1: 'Custom',
      // TypeScript error: 'invalidKey' is not in the default locales
      // invalidKey: 'This will error',
    },
  },
})
```

## Combining Overrides and Extensions

You can use both overrides and extensions in a single call:

```typescript
const combined = i18nFactory.getTranslations({
  overrideDefaults: {
    'en-US': {
      key1: 'Custom Value',
    },
  },
  extendedLocales: {
    'es-ES': {
      key1: 'Valor Personalizado',
      key2: 'Valor 2',
    },
  },
})

console.log(combined['en-US'].key1) // 'Custom Value'
console.log(combined['en-US'].key2) // 'Value 2'
console.log(combined['es-ES'].key1) // 'Valor Personalizado'
```

## Immutability

All returned objects are frozen, preventing accidental mutations:

```typescript
const translations = i18nFactory.getTranslations()

// This will fail silently (or throw in strict mode)
// translations['en-US'].key1 = 'Modified'
```
