---
name: getting-started
description: >
  Domain-specific class-validator decorators for dates, times, money, nullable/undefinable
  fields, and Belgian identifiers. Reference catalog of all 23 validators with usage examples.
type: reference
library: validators
exports:
  - IsNullable
  - IsUndefinable
  - IsNullableWhen
  - IsNullWhen
  - IsDateWithoutTimeString
  - IsAfterDateString
  - IsBeforeDateString
  - IsSameOrAfterDateString
  - IsSameOrBeforeDateString
  - IsAfterDateTimeString
  - IsBeforeDateTimeString
  - IsSameOrAfterDateTimeString
  - IsSameOrBeforeDateTimeString
  - IsAfterTodayString
  - IsBeforeTodayString
  - IsAfterTimeString
  - IsTimeString
  - IsShortTimeString
  - IsMoneyString
  - IsQueryBoolean
  - IsRRN
  - IsValidPluxeeCustomerId
  - StartsWith
---

# @wisemen/validators — Getting Started

Domain-specific class-validator decorators for NestJS DTOs covering dates, times, money, nullable fields, and Belgian identifiers.

## When to Use

- Validating date/time strings with relative comparisons (before, after, same-or-after)
- Handling nullable or undefinable fields that should skip validation when null/undefined
- Validating monetary values with scale and max value constraints
- Validating Belgian-specific identifiers (RRN, Pluxee)

**Use instead:** Standard `class-validator` decorators for generic validation (IsString, IsEmail, IsUUID, etc.).

## Import

```ts
import {
  IsNullable, IsDateWithoutTimeString, IsAfterDateString,
  IsMoneyString, IsTimeString,
} from '@wisemen/validators'
```

## Quick Start

```ts
import {
  IsNullable, IsDateWithoutTimeString, IsAfterDateString,
  IsMoneyString, IsTimeString, IsNullableWhen,
} from '@wisemen/validators'
import { IsString, IsOptional } from 'class-validator'

export class ContractDto {
  @IsDateWithoutTimeString()
  startDate: string  // YYYY-MM-DD

  @IsAfterDateString((obj) => obj.startDate)
  endDate: string  // Must be after startDate

  @IsNullable()
  @IsMoneyString({ maxValue: 999999, maxScale: 2 })
  salary: string | null  // e.g. "45000.00" or null

  @IsTimeString()
  startTime: string  // hh:mm:ss or 24:00:00

  @IsNullableWhen((obj) => obj.salary === null)
  @IsString()
  currency: string | null  // Required when salary is set
}
```

## Validator Reference

| Validator | Validates |
|-----------|-----------|
| `IsNullable` | Skips validation when value is `null` |
| `IsUndefinable` | Skips validation when value is `undefined` |
| `IsNullableWhen(condition)` | Skips validation when null AND condition is true |
| `IsNullWhen(condition)` | Value must be `null` when condition is true |
| `IsDateWithoutTimeString` | YYYY-MM-DD format (optionally allows `infinity`) |
| `IsAfterDateString(dateFn)` | Date is after the callback-provided date |
| `IsBeforeDateString(dateFn)` | Date is before the callback-provided date |
| `IsSameOrAfterDateString(dateFn)` | Date is same or after |
| `IsSameOrBeforeDateString(dateFn)` | Date is same or before |
| `IsAfterDateTimeString(dateFn)` | DateTime is after |
| `IsBeforeDateTimeString(dateFn)` | DateTime is before |
| `IsSameOrAfterDateTimeString(dateFn)` | DateTime is same or after |
| `IsSameOrBeforeDateTimeString(dateFn)` | DateTime is same or before |
| `IsAfterTodayString` | Date is after today |
| `IsBeforeTodayString` | Date is before today |
| `IsAfterTimeString(timeFn)` | Time is after the callback-provided time |
| `IsTimeString` | hh:mm:ss or 24:00:00 format |
| `IsShortTimeString` | hh:mm or 24:00 format |
| `IsMoneyString({ maxValue, maxScale })` | Numeric string with optional scale/max constraints |
| `IsQueryBoolean` | String is `'true'` or `'false'` |
| `IsRRN` | Belgian national register number (11 digits, MOD97) |
| `IsValidPluxeeCustomerId` | Pluxee customer ID with MOD97 checksum |
| `StartsWith(prefixes)` | String starts with one of the given prefixes |

## Source Files

For full API details, read the source files and tests.

- All exports: `lib/index.ts`
- Representative validators: `lib/is-nullable/is-nullable.validator.ts`, `lib/is-money-string/is-money-string.validator.ts`, `lib/is-after-date-string/is-after-date-string.validator.ts`
- Tests: `lib/*/*.test.ts`
