---
name: getting-started
description: Custom class-validator decorators for NestJS DTOs. Use when validating optional, nullable or conditional values.
---

## Import

```ts
import { IsUndefinable, IsNullable, } from '@wisemen/validators'
```

## Common validators

### Optional fields

```ts
export class CreateUserCommand {
  @IsString()
  @IsUndefinable()
  middleName?: string
}
```

### Nullable fields

```ts
export class UpdateUserCommand {
  @IsString()
  @IsNullable()
  bio: string | null
}
```


### Conditional validation

```ts
export class PaymentDto {
  @IsString()
  type: string

  @IsNullWhen('type', (type) => type !== 'bank_transfer')
  @IsString()
  iban: string | null
}
```

## Available validators

- `IsUndefinable` - Skip validation when undefined
- `IsNullable` - Skip validation when null
- `IsNullableWhen` - Conditional nullable
- `IsNullWhen` - Must be null when condition
- `IsDateWithoutTimeString` - Date format YYYY-MM-DD, deprecated: use @wisemen/datewise
- `IsTimeString` - Time format HH:mm:ss, deprecated: use @wisemen/datewise
- `IsShortTimeString` - Time format HH:mm, deprecated: use @wisemen/datewise
- `IsMoneyString` - Money format validation
- `IsAfterDateString` - Date after another date
- `IsBeforeDateString` - Date before another date
- `IsSameOrAfterDateString` - Date same or after
- `IsSameOrBeforeDateString` - Date same or before
- `IsAfterTodayString` - Date after today
- `IsBeforeTodayString` - Date before today
- `IsAfterDateTimeString` - DateTime comparisons
- `IsBeforeDateTimeString` - DateTime comparisons
- `IsSameOrAfterDateTimeString` - DateTime comparisons
- `IsSameOrBeforeDateTimeString` - DateTime comparisons
- `IsAfterTimeString` - Time after another time
- `IsQueryBoolean` - Parse query boolean
- `StartsWith` - String starts with value
- `IsRrn` - Belgian RRN validation
- `IsPluxeeCustomerId` - Pluxee customer ID
