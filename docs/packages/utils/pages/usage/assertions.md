# Assertions

The package exports three assertion helpers:

- `assert`
- `assertDefined`
- `assertNever`

## Import

```typescript
import {
  assert,
  assertDefined,
  assertNever,
} from '@wisemen/vue-core-utils'
```

## assert

Asserts that a condition is truthy.

```typescript
assert(items.length > 0, 'Items must not be empty')
```

When the condition is falsy, it throws:

```text
Error: Assertion failed: Items must not be empty
```

## assertDefined

Asserts that a value is neither `null` nor `undefined`, while narrowing the type.

```typescript
const element = document.getElementById('root')
assertDefined(element, '#root must exist')

element.innerHTML = 'Ready'
```

## assertNever

Use in exhaustive switch statements.

```typescript
type Direction = 'left' | 'right'

function move(direction: Direction): void {
  switch (direction) {
    case 'left':
      return
    case 'right':
      return
    default:
      assertNever(direction)
  }
}
```

This helps catch missing cases during development and throws at runtime if an unreachable path is hit.