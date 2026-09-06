# `@wisemen/nestjs-common`

Small shared TypeScript helpers used across Wisemen NestJS packages.

## What it provides

- `parseEnvList(...)` for comma-separated environment variables
- `toBoolean(...)` for strict boolean coercion
- `Uuid<Brand>` and `generateUuid<Brand>()` for branded UUID strings
- `exhaustiveCheck(...)` for unreachable branches in exhaustive switches
- `constructIfNotNull(...)` for constructing values from nullable inputs

## Usage

```ts
import {
  constructIfNotNull,
  exhaustiveCheck,
  generateUuid,
  parseEnvList,
  toBoolean,
  type Uuid
} from '@wisemen/nestjs-common'

const expiresAt = constructIfNotNull(Date, process.env.EXPIRES_AT)

const allowedOrigins = parseEnvList(process.env.CORS_ALLOWED_ORIGINS)
const enableDocs = toBoolean(process.env.ENABLE_DOCS ?? 'false')

type UserUuid = Uuid<'user'>
const userUuid = generateUuid<UserUuid>()

type DeliveryState = 'pending' | 'sent'

function toLabel(state: DeliveryState): string {
  switch (state) {
    case 'pending':
      return 'Pending'
    case 'sent':
      return 'Sent'
    default:
      return exhaustiveCheck(state)
  }
}
```

`toBoolean(...)` only accepts `true`, `false`, `'true'`, or `'false'`. Use it
when invalid configuration should fail fast instead of being silently coerced.
