---
name: getting-started
description: Custom class-validator decorators for NestJS DTOs. Use when validating optional, nullable or conditional values.
---

## Import

```ts
import { IsUndefinable, IsNullable, IsPhoneNumber } from '@wisemen/validators'
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

### Phone numbers

Normalizes and validates a phone number in one step: it rewrites the incoming value to E.164
format (e.g. `+32485233648`) before validating it, so messy user input gets cleaned up
automatically as long as `ValidationPipe` has `transform: true` enabled (the Nest default when
using `app.useGlobalPipes(new ValidationPipe())` with `transform: true`, or per-controller).

```ts
export class UpdateContactCommand {
  @IsPhoneNumber()
  phone: string
}
```

Pass `defaultCountry` to parse numbers written in local/national format (no leading `+`):

```ts
export class UpdateContactCommand {
  @IsPhoneNumber({ defaultCountry: 'BE' })
  phone: string
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
- `IsPhoneNumber` - Normalizes to E.164 and validates a phone number
