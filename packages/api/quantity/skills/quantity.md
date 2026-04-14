---
name: quantity
description: "Use when integrating @wisemen/quantity in another project: modeling domain values as quantities, validating DTOs, persisting quantities with TypeORM, and handling unit conversions safely."
---

# Quantity Skill

## Overview

This skill helps an AI use `@wisemen/quantity` in another project.

Use it to integrate quantity value objects in application code, DTO validation,
and database persistence while preserving type safety and unit correctness.

## Step 1: Confirm integration context

Before coding, identify how the target project uses:
- runtime: Node.js / NestJS
- validation: class-validator + class-transformer
- API docs: @nestjs/swagger
- persistence: TypeORM (if applicable)

Then install or reference the package in that project.

```bash
pnpm add @wisemen/quantity
```

If working in this monorepo workspace, prefer workspace imports already
available in the project.

## Step 2: Use quantities in domain logic

Import the required type and unit enum (example with `Mass`):

```ts
import { Mass, MassUnit } from '@wisemen/quantity'

const payloadWeight = new Mass(1250, MassUnit.GRAM)
const inKg = payloadWeight.asNumber(MassUnit.KILOGRAM)

const maxAllowed = new Mass(2, MassUnit.KILOGRAM)
const isAllowed = payloadWeight.isLessThanOrEqualTo(maxAllowed)
```

Prefer quantity methods instead of raw number arithmetic:
- unit conversion: `to(...)`, `asNumber(...)`
- comparisons: `isEqualTo`, `isLessThan`, `isMoreThan`, ...
- math: `add`, `subtract`, `multiply`, `divide`, `modulo`

## Step 3: Use quantities in request/response DTOs (NestJS)

Use package-provided DTOs and validators to keep API contracts typed.

```ts
import { IsMass, MassDto } from '@wisemen/quantity'

class CreateShipmentDto {
	@IsMass()
	weight: MassDto
}
```

When converting in handlers/services:
- parse input DTO to quantity using `dto.parse()`
- map quantity back to DTO with `XDto.from(quantity)` for responses

## Step 4: Persist quantities with TypeORM

Use the quantity column decorator so DB stores numeric values in a known unit.

```ts
import { Mass, MassColumn, MassUnit } from '@wisemen/quantity'

class PackageEntity {
	@MassColumn(MassUnit.KILOGRAM)
	declaredWeight: Mass
}
```

Guideline:
- choose one storage unit per field (often SI base unit)
- convert for display at API/UI boundaries, not in persistence layer

## Step 5: External usage checklist

When integrating in another project, verify:
- [ ] All arithmetic/comparisons use quantity methods, not plain numbers.
- [ ] Unit conversions happen explicitly at boundaries.
- [ ] DTOs use package validators (`IsX`) where available.
- [ ] Entity fields use package column decorators (`XColumn`) where applicable.
- [ ] API responses expose `{ value, unit }` consistently via DTOs.

## Step 6: Common pitfalls to avoid

- Mixing raw numbers from different units in one expression.
- Persisting one unit while assuming another at read time.
- Using floating-point equality for cross-unit calculations without tolerance
	when business rules require tolerance.
- Skipping DTO parsing and passing plain objects as quantities.

## Available quantity families

Use these exports based on domain need:
- `Current`
- `Distance`
- `Duration`
- `Energy`
- `Mass`
- `Power`
- `Speed`
- `Temperature`
- `Voltage`
