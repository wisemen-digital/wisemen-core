# Uuid Util

`UuidUtil` helps with UUID generation and validation.

## Import

```typescript
import { UuidUtil } from '@wisemen/vue-core-utils'
```

## NIL

`UuidUtil.NIL` exposes the all-zero UUID constant.

```typescript
UuidUtil.NIL
// '00000000-0000-0000-0000-000000000000'
```

## generate

Generates a random UUID v4.

```typescript
const id = UuidUtil.generate()
// 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```

## isValid

Checks whether a string is a valid canonical UUID.

```typescript
UuidUtil.isValid('f47ac10b-58cc-4372-a567-0e02b2c3d479')
// true

UuidUtil.isValid('not-a-uuid')
// false
```

## isNil

Checks if a UUID equals the nil UUID.

```typescript
UuidUtil.isNil('00000000-0000-0000-0000-000000000000')
// true
```

## isNonNil

Validates that a UUID is valid and not nil.

```typescript
UuidUtil.isNonNil('f47ac10b-58cc-4372-a567-0e02b2c3d479')
// true

UuidUtil.isNonNil(UuidUtil.NIL)
// false
```