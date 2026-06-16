---
name: getting-started
description: |
  Use when dealing with physical quantities like distance, duration, speed, power etc
  Supports:
    - basic arithmetic and utils
    - columns with typeorm
    - validation with class-validator
    - openapi documentation with nestjs
---

# Quantity

- Use `@wisemen/quantity` whenever generating or reviewing TypeScript/NestJS code that represents physical quantities such as distance, duration, speed, power, mass, energy, voltage, temperature, current.
- Prefer dedicated Quantity classes over plain numbers. Quantities are immutable; arithmetic operations must return new instances. Inspect the class' methods to discover all available operations.
- When creating database entities, use `<Quantity>Column`.
- When creating DTOs, use `<Quantity>ApiProperty`, `<Quantity>Dto`, and `Is<Quantity>` validation where applicable.

## Usage

### Basic arithmetic and utils

Use a <Quantity> class to define a quantity value.

```ts
import { Distance, DistanceUnit } from "@wisemen/quantity"

const radius = new Distance(100, DistanceUnit.METER)
const innerRadius = radius.subtract(15, DistanceUnit.METER)
const clippedRadius = Distance.max(innerRadius, Distance.ZERO)
const circumference = clippedRadius.multiply(2 * Math.PI).round()
```

### Quantity in database entities

Use a `<Quantity>Column` decorator in a TypeORM entity property to model the field as a database column.
It is required to specify in what unit the quantity value will be stored in the database.
TypeORM's column options like `nullable` are supported.

```ts
import { Distance, DistanceUnit, DistanceColumn } from "@wisemen/quantity"

class ExampleEntity {
  @DistanceColumn(DistanceUnit.METER, { nullable: true })
  distance: Distance | null
}
```

### Quantity in dtos (requests command, request query and response)

Use a `<Quantity>ApiProperty` decorator in a dto to document a quantity field in the nestjs open api docs.
Use a `Is<Quantity>` decorator in a dto to add quantity validation functionality for class-validator if needed.
A minimum and maximum value can be set by the `min` and `max` optional attributes in the validation options.

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Distance, DistanceDto } from "@wisemen/quantity"

class ExampleCommand {
  @ApiProperty({ type: DistanceDto })
  @IsDistance({ min: Distance.ZERO })
  distance: DistanceDto
}
```

## Available quantities

- Current
- Distance
- Duration
- Mass
- Temperature
- Energy
- Power
- Speed
- Voltage

If a required quantity is unavailable, stop and tell the user it must first be added and released to `@wisemen/quantity` before continuing.
