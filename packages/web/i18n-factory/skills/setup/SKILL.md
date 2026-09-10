---
name: i18n-factory-setup
description: >
  Create type-safe i18n translation factories with createI18nFactory. Supports
  default locales, partial overrides per locale, and extending with new locales.
  Used by packages to ship translations that projects can customize.
type: core
library: vue-core-i18n-factory
---

# @wisemen/vue-core-i18n-factory — Setup

## Import

```ts
import { createI18nFactory } from '@wisemen/vue-core-i18n-factory'
import type { I18nFactory } from '@wisemen/vue-core-i18n-factory'
```

## Quick Start

### 1. Define translations in a package or shared module

```ts
// translations.ts
import { createI18nFactory } from '@wisemen/vue-core-i18n-factory'

export const contactI18n = createI18nFactory({
  'en-US': {
    'contact.title': 'Contacts',
    'contact.create': 'Create Contact',
    'contact.delete.confirm': 'Are you sure you want to delete this contact?',
  },
  'nl-BE': {
    'contact.title': 'Contacten',
    'contact.create': 'Contact Aanmaken',
    'contact.delete.confirm': 'Ben je zeker dat je dit contact wilt verwijderen?',
  },
})
```

### 2. Use translations as-is

```ts
const translations = contactI18n.getTranslations()
// { 'en-US': { 'contact.title': 'Contacts', ... }, 'nl-BE': { ... } }
```

### 3. Override specific keys in a project

```ts
const translations = contactI18n.getTranslations({
  overrideDefaults: {
    'en-US': { 'contact.title': 'People' },
  },
})
// en-US 'contact.title' is now 'People', all other keys unchanged
```

### 4. Add a new locale

```ts
const translations = contactI18n.getTranslations({
  extendedLocales: {
    'fr-FR': {
      'contact.title': 'Contacts',
      'contact.create': 'Créer un Contact',
      'contact.delete.confirm': 'Êtes-vous sûr de vouloir supprimer ce contact?',
    },
  },
})
// All keys required for new locales — TypeScript enforces completeness
```

### 5. Combine overrides and extensions

```ts
const translations = contactI18n.getTranslations({
  overrideDefaults: {
    'en-US': { 'contact.title': 'People' },
  },
  extendedLocales: {
    'fr-FR': {
      'contact.title': 'Contacts',
      'contact.create': 'Créer un Contact',
      'contact.delete.confirm': 'Êtes-vous sûr de vouloir supprimer ce contact?',
    },
  },
})
```

## Source Files

For full API details, read the source files.

- Factory: `src/factory.ts`
- Types: `src/types.ts`
