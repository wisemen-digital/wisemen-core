---
name: getting-started
description: Use when constructing values from nullable inputs, parsing comma-separated env vars, coercing boolean config values, generating branded UUIDs, or asserting exhaustive TypeScript switches with @wisemen/nestjs-common.
---

# @wisemen/nestjs-common - Getting Started

Use these helpers instead of rewriting small config and type-safety utilities in
each backend package.

## Construct From Nullable Inputs

Use `constructIfNotNull(...)` to pass a non-nullish value to a single-argument
constructor. Both `null` and `undefined` inputs are normalized to `null`.

```ts
import { constructIfNotNull } from '@wisemen/nestjs-common'

const expiresAt = constructIfNotNull(Date, command.expiresAt)
```

## Parse Environment Lists

Use `parseEnvList(...)` for comma-separated environment variables. It trims
entries and drops empty values.

```ts
import { parseEnvList } from '@wisemen/nestjs-common'

const scopes = parseEnvList(process.env.AUTH_SCOPES)
```

## Parse Strict Booleans

Use `toBoolean(...)` when configuration should accept only real booleans or the
strings `'true'` and `'false'`.

```ts
import { toBoolean } from '@wisemen/nestjs-common'

const isEnabled = toBoolean(process.env.FEATURE_ENABLED ?? 'false')
```

`toBoolean(...)` throws for any other value.

## Brand UUID Strings

Use `Uuid<Brand>` and `generateUuid<Brand>()` when a package wants nominal UUID
types instead of plain strings.

```ts
import { generateUuid, type Uuid } from '@wisemen/nestjs-common'

type ContactUuid = Uuid<'contact'>

const contactUuid = generateUuid<ContactUuid>()
```

## Assert Exhaustive Branches

Use `exhaustiveCheck(...)` in the default branch of exhaustive switches.

```ts
import { exhaustiveCheck } from '@wisemen/nestjs-common'

type Status = 'draft' | 'published'

function toLabel(status: Status): string {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'published':
      return 'Published'
    default:
      return exhaustiveCheck(status)
  }
}
```
