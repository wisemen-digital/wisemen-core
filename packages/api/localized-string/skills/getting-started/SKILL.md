---
name: getting-started
description: Use when storing and validating multilingual text in NestJS apis with TypeORM and class-validator.
---

# @wisemen/localized-string - Getting Started

Use `LocalizedString` when a field needs multiple translations. Use `LocalizedStringDto` in DTOs, `@IsLocalizedString(...)` to validate languages, and `@LocalizedStringColumn()` to persist the value as `jsonb`.

```ts
import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsLocalizedString, LocalizedString, LocalizedStringColumn, LocalizedStringDto, initLocalizedString } from '@wisemen/localized-string'

initLocalizedString({
  currentLocale: () => 'en', // Replace with your own context-dependent locale resolver.
  missingTranslationBehavior: 'empty'
})

export class CreateProductDto {
  @ApiProperty({ type: LocalizedStringDto })
  @IsLocalizedString({
    requiredLanguages: ['en', 'fr']
  })
  name: LocalizedStringDto
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @LocalizedStringColumn()
  name: LocalizedString
}

const product = new Product()
product.name = dto.name.parse()

const label = product.name.translate('nl', {
  fallbackLocales: ['en']
})
```
