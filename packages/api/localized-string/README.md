# @wisemen/localized-string

A TypeScript library for handling multilingual content with flexible translation fallback strategies. Built for TypeORM, NestJS, and class-validator integration, it provides type-safe localized string management with comprehensive validation support.

## Features

- **Flexible Fallback Chain**: Locale hierarchy with customizable fallback strategies per translation
- **Multiple Missing Translation Behaviors**: Choose between empty string, first available, or throw error
- **TypeORM Integration**: Custom column type for seamless database storage
- **Class Validator Decorators**: Built-in validation for unique locales and required languages
- **NestJS Support**: DTO with automatic transformation and API documentation
- **Type Safe**: Full TypeScript support with strict typing

## Installation

```bash
pnpm add @wisemen/localized-string
```

### Peer Dependencies

```bash
pnpm add typeorm class-validator class-transformer @nestjs/swagger @nestjs/common
```

## Quick Start

```typescript
import { LocalizedString, initLocalizedString } from '@wisemen/localized-string'

// Initialize once in your app
initLocalizedString({
  currentLocale: () => 'en', // Function that returns current locale
  missingTranslationBehavior: 'empty' // Global behavior when translation not found
})

// Create a localized string
const greeting = new LocalizedString([
  { locale: 'en', value: 'Hello' },
  { locale: 'fr', value: 'Bonjour' },
  { locale: 'de', value: 'Hallo' }
])

// Translate
greeting.translate('en') // "Hello"
greeting.translate('fr') // "Bonjour"
greeting.translate() // Uses current locale (en): "Hello"

// With fallback locales
greeting.translate('es', { 
  fallbackLocales: ['en', 'fr'] 
}) // "Hello" (falls back to en)
```

## Core Concepts

### LocalizedString

The main class for storing and retrieving translations.

```typescript
interface LocalizedValue {
  locale: string  // ISO locale code (e.g., 'en', 'en-US', 'fr-FR')
  value: string   // Translated text
}

class LocalizedString {
  constructor(values: LocalizedValue[])
  translate(locale?: string, options?: TranslateOptions): string
  toJSON(): LocalizedValue[]
}
```

### Translation Fallback Chain

When a translation is requested, the system follows this order:

1. **Exact locale match** (e.g., `en-US`)
2. **Base locale** (e.g., `en-US` → `en`)
3. **Fallback locales** (in order, if provided in options)
4. **Missing translation behavior** (empty or throw)

```typescript
const text = new LocalizedString([
  { locale: 'en', value: 'Color' },
  { locale: 'en-GB', value: 'Colour' }
])

// Exact match
text.translate('en-GB') // "Colour"

// Base locale fallback
text.translate('en-US') // "Color" (falls back to 'en')

// With fallback locales
text.translate('de', { 
  fallbackLocales: ['en'] 
}) // "Color"
```

### Missing Translation Behaviors

Configure how to handle missing translations globally or per-call:

```typescript
// Global configuration
initLocalizedString({
  currentLocale: () => getCurrentLang(),
  missingTranslationBehavior: 'empty' // 'empty' | | 'throw'
})

const text = new LocalizedString([
  { locale: 'fr', value: 'Bonjour' }
])

// Per-call override
text.translate('de', { missingTranslationBehavior: 'empty' })  // ""
text.translate('de', { missingTranslationBehavior: 'throw' })  // throws missingTranslationBehaviorError
```

#### Behavior Types

- **`'empty'`** (default): Returns empty string `''`
- **`'throw'`**: Throws `missingTranslationBehaviorError` with helpful context

## TypeORM Integration

### Column Decorator

Store localized strings as JSONB in PostgreSQL:

```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { LocalizedStringColumn } from '@wisemen/localized-string'

@Entity()
class Product {
  @PrimaryGeneratedColumn()
  id: number

  @LocalizedStringColumn()
  name: LocalizedString

  @LocalizedStringColumn()
  description: LocalizedString
}
```

### Database Storage

Localized strings are stored as JSONB arrays:

```json
[
  { "locale": "en", "value": "Product Name" },
  { "locale": "fr", "value": "Nom du Produit" },
  { "locale": "de", "value": "Produktname" }
]
```

### Querying

```typescript
const product = await productRepository.findOne({ where: { id: 1 } })

// Access translated values
const englishName = product.name.translate('en')
const currentName = product.name.translate() // Uses current locale

// Update
product.name = new LocalizedString([
  { locale: 'en', value: 'Updated Name' },
  { locale: 'fr', value: 'Nom Mis à Jour' }
])
await productRepository.save(product)
```

## NestJS Integration

### DTO with Validation

```typescript
import { IsLocalizedString, LocalizedStringCommand } from '@wisemen/localized-string'

class CreateProductDto {
  @IsLocalizedString({
    requiredLanguages: ['en', 'fr'],
    forbidNonRequiredLanguages: true
  })
  name: LocalizedStringCommand

  @IsLocalizedString({
    requiredLanguages: ['en']
  })
  description: LocalizedStringCommand
}
```

### Request/Response Example

```typescript
// POST /products
{
  "name": {
    "items": [
      { "locale": "en", "value": "Product Name" },
      { "locale": "fr", "value": "Nom du Produit" }
    ]
  }
}

// Controller
@Post()
create(@Body() dto: CreateProductDto) {
  const product = new Product()
  product.name = dto.name.parse() // Converts to LocalizedString
  return this.productService.create(product)
}
```

## Validation

### IsLocalizedString

Validates the entire localized string structure with required languages:

```typescript
class ProductDto {
  @IsLocalizedString({
    requiredLanguages: ['en', 'fr'],      // Must contain these locales
    forbidNonRequiredLanguages: false     // Allow additional locales
  })
  name: LocalizedStringCommand

  @IsLocalizedString({
    requiredLanguages: ['en'],
    forbidNonRequiredLanguages: true      // Only 'en' allowed
  })
  strictName: LocalizedStringCommand
}
```

The `@IsLocalizedString` decorator automatically applies:
- `@Type(() => LocalizedStringCommand)` for class-transformer
- `@ValidateNested()` for nested validation
- Custom validation for required languages

### IsUniqueLanguage

Ensures each locale appears only once in the items array:

```typescript
class LocalizedStringItemCommand {
  @IsString()
  locale: string

  @IsString()
  value: string
}

class LocalizedStringCommand {
  @Type(() => LocalizedStringItemCommand)
  @IsArray()
  @ValidateNested({ each: true })
  @IsUniqueLanguage()  // Validates unique locales
  items: LocalizedStringItemCommand[]

  parse(): LocalizedString {
    return new LocalizedString(this.items)
  }
}
```

## Advanced Usage

### Dynamic Current Locale

```typescript
// Application-wide locale management
let userLocale = 'en'

initLocalizedString({
  currentLocale: () => userLocale,
  missingTranslationBehavior: 'empty'
})

// Change locale dynamically
userLocale = 'fr'
text.translate() // Now uses 'fr'
```

### Per-Instance Fallback Strategies

```typescript
const title = new LocalizedString([
  { locale: 'en', value: 'Title' },
  { locale: 'de', value: 'Titel' }
])

const description = new LocalizedString([
  { locale: 'fr', value: 'Description' }
])

// Different fallback strategies per instance
title.translate('es', { 
  fallbackLocales: ['en'],
  missingTranslationBehavior: 'empty' 
}) // ""

description.translate('es', { 
  fallbackLocales: ['fr'],
  missingTranslationBehavior: 'throw' 
}) // "Error"
```

### Locale Variants

The system automatically handles locale variants:

```typescript
const text = new LocalizedString([
  { locale: 'en', value: 'Color' },
  { locale: 'en-GB', value: 'Colour' }
])

text.translate('en-US')  // "Color" (falls back to 'en')
text.translate('en-GB')  // "Colour" (exact match)
```

### Custom Error Handling

```typescript
import { missingTranslationBehaviorError } from '@wisemen/localized-string'

try {
  text.translate('unknown', { missingTranslationBehavior: 'throw' })
} catch (error) {
  if (error instanceof missingTranslationBehaviorError) {
    console.error(`Translation not found for locale: ${error.message}`)
    // Error includes available locales for debugging
  }
}
```

## API Reference

### initLocalizedString(options)

Initialize the localization system globally.

```typescript
interface InitOptions {
  currentLocale: () => string
  missingTranslationBehavior?: missingTranslationBehaviorBehavior // 'empty' | 'throw'
}
```

### LocalizedString

#### Constructor

```typescript
new LocalizedString(values: LocalizedValue[])
```

#### translate(locale?, options?)

```typescript
translate(locale?: string, options?: TranslateOptions): string

interface TranslateOptions {
  fallbackLocales?: string[]
  missingTranslationBehavior?: missingTranslationBehaviorBehavior
}
```

#### toJSON()

```typescript
toJSON(): LocalizedValue[]
```

Returns the raw array of locale/value pairs (used by TypeORM).

### Validators

#### @IsLocalizedString(options?)

```typescript
interface IsLocalizedStringOptions {
  requiredLanguages?: string[]
  forbidNonRequiredLanguages?: boolean
}
```

#### @IsUniqueLanguage(validationOptions?)

```typescript
@IsUniqueLanguage(validationOptions?: ValidationOptions)
```

## Best Practices

1. **Always initialize** before using LocalizedString:
   ```typescript
   initLocalizedString({ currentLocale: () => getCurrentLocale() })
   ```

2. **Use DTOs for API inputs**:
   ```typescript
   @IsLocalizedString({ requiredLanguages: ['en'] })
   name: LocalizedStringCommand
   ```

3. **Store as entities, translate on read**:
   ```typescript
   const product = await repository.findOne({ where: { id } })
   const name = product.name.translate() // Lazy translation
   ```

4. **Handle missing translations gracefully**:
   ```typescript
   // Global default
   initLocalizedString({ missingTranslationBehavior: 'empty' })
   
   // Or per-call for critical fields
   text.translate(locale, { missingTranslationBehavior: 'throw' })
   ```

5. **Use fallback locales for regional variants**:
   ```typescript
   text.translate('es-MX', { fallbackLocales: ['es', 'en'] })
   ```

## License

GPL

## Author

Wisemen