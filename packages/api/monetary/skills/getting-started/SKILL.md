---
name: getting-started
description: |
  Use when dealing with monetary values (euros, dollars etc)
  Supports:
    - basic arithmetic and rounding utils
    - columns with typeorm
    - validation with class-validator
    - openapi documentation with nestjs
---

# Monetary

- Use `@wisemen/monetary` whenever generating or reviewing TypeScript/NestJS code that represents monetary values.
- Prefer dedicated Monetary classes over plain numbers. Monetary instances are immutable; arithmetic operations must return new instances. Inspect the class' methods to discover all available operations.
- Always round after calculations according to the business rules. (eg. round on the end of a calculation chain vs. round in every intermediate step)
- When creating database entities, use a dedicated `MonetaryColumn`.
- When creating DTOs, use dedicated `MonetaryApiProperty`, `MonetaryDto`, and `IsMonetary` validation where applicable.

## Usage

### Configure monetary utils

Configure and export dedicated monetary utils and types with a specific currency and precision to use them project-wide. 

```ts
import { createMonetaryUtils, Currency } from "@wisemen/monetary"

export const {
  Column: EurosColumn,
  ApiProperty: EurosApiProperty,
  Validator: IsEuros,
  Class: Euros,
  Dto: EurosDto,
  DtoBuilder: EurosDtoBuilder
} = createMonetaryUtils(Currency.EUR, 2, 'Euros')

export type Euros = InstanceType<typeof Euros>
export type EurosDto = InstanceType<typeof EurosDto>
export type EurosDtoBuilder = InstanceType<typeof EurosDtoBuilder>
```

### Basic arithmetic and utils

Use a Monetary class to define a monetary value and do calculations. 
Precision is an integer used to interpret the amount integer of a monetary. It gives information where to place the decimal point in amount integer for the given currency.

```ts
const netPrice = new Euros(24_99, 2)
const discount = new Euros({ amount: 5_00, precision: 2, currency: Currency.EUR })
const grossPrice = netPrice.subtract(discount).multiply(1.21).round()
```

### Monetary in database entities

Use a dedicated `MonetaryColumn` decorator in a TypeORM entity property to model the field as a database column.
TypeORM's column options like `nullable` are supported. 
- inserting a not rounded monetary will throw an error
- inserting a monetary with lower precision will automatically be converted to the correct precision
- inserting a monetary with higher precision will throw a PrecisionLossError.

```ts
class Product {
  @EurosColumn({ nullable: true })
  price: Euros | null
}
```

### Monetaries in dtos (requests command, request query and response)

Use a dedicated `MonetaryApiProperty` decorator in a dto to document a monetary field in the nestjs open api docs.
Use a dedicated `IsMonetary` decorator in a dto to add monetary validation functionality for class-validator if needed.

```ts
export class ProductDto {
  @EurosApiProperty()
  @IsEuros()
  price: EurosDto
}
```
