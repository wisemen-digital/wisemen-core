# Package Integration

## Exposing the Factory in Packages

When building packages that require internationalization, you should expose your i18n factory through a standard `/i18n` export path. This allows consumers to easily access and extend your package's translations while maintaining type safety.

## Standard Pattern

### Directory Structure

Create an `i18n` directory in your package's source:

```
src/
├── i18n/
│   ├── index.ts          # Main export
│   └── factory.ts        # Factory definition
├── components/
├── hooks/
└── index.ts              # Package main export
```

### Creating the Factory

In `src/i18n/factory.ts`, define your default locales and factory:

```typescript
import { createI18nFactory } from '@wisemen/vue-core-i18n-factory'

export const defaultMessages = {
  'en-US': {
    'component.title': 'Component Title',
    'component.description': 'A useful component',
    'error.required': 'This field is required',
    'error.invalid': 'Invalid input',
  },
  'nl-BE': {
    'component.title': 'Componenttitel',
    'component.description': 'Een nuttige component',
    'error.required': 'Dit veld is verplicht',
    'error.invalid': 'Ongeldige invoer',
  },
} as const

export const i18n = createI18nFactory(defaultMessages)
```

### Exporting from the Package

In `src/i18n/index.ts`, export the factory and types:

```typescript
export type { I18nFactory } from '@wisemen/vue-core-i18n-factory'
export { i18n, defaultMessages } from './factory'

// Export the type of translations for consumers to extend
export type Messages = typeof defaultMessages
```

### Update Package Exports

In `src/index.ts`, add the i18n export:

```typescript
// Export main components
export * from './components'

// Export i18n factory and types
export * from './i18n'
```

Update your `package.json` to include the i18n subpath export:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    },
    "./i18n": {
      "types": "./dist/i18n/index.d.mts",
      "import": "./dist/i18n/index.mjs"
    }
  }
}
```

## Consumer Usage

Consumers of your package can now import and use your i18n factory:

### Basic Import

```typescript
import { i18n } from '@your-package/i18n'

// Get default translations
const translations = i18n.getTranslations()

console.log(translations['en-US']['component.title'])
```

### With Overrides

```typescript
import { i18n } from '@your-package/i18n'

// Override specific keys for customization
const customized = i18n.getTranslations({
  overrideDefaults: {
    'en-US': {
      'component.title': 'Custom Title',
    },
  },
})
```

### Adding New Locales

```typescript
import { i18n } from '@your-package/i18n'

// Extend with new locales
const extended = i18n.getTranslations({
  extendedLocales: {
    'de-DE': {
      'component.title': 'Komponententitel',
      'component.description': 'Eine nützliche Komponente',
      'error.required': 'Erforderlich',
      'error.invalid': 'Ungültige Eingabe',
    },
  },
})
```

## Best Practices

### 1. Use Consistent Namespacing

Prefix all keys with your package or feature name to avoid collisions:

```typescript
const defaultMessages = {
  'en-US': {
    'mypackage.form.title': 'Form',
    'mypackage.form.submit': 'Submit',
    'mypackage.errors.required': 'Required field',
  },
}
```

### 2. Export Separate Concerns

If your package has multiple features, consider splitting i18n:

```typescript
// src/i18n/form.ts
export const formMessages = { /* form translations */ }

// src/i18n/table.ts
export const tableMessages = { /* table translations */ }

// src/i18n/index.ts
export { formMessages, tableMessages }
```

### 3. Document Required Keys

Include JSDoc comments to help consumers understand what keys must be provided:

```typescript
/**
 * Messages required for the Form component
 * 
 * @example
 * ```ts
 * const translations = formFactory.getTranslations({
 *   extendedLocales: {
 *     'es-ES': {
 *       'mypackage.form.title': 'Formulario',
 *       'mypackage.form.submit': 'Enviar',
 *       'mypackage.errors.required': 'Campo requerido',
 *     }
 *   }
 * })
 * ```
 */
export const formMessages = { /* ... */ }
```
