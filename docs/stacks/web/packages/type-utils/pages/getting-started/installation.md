# Installation

A quick tutorial to get you started with `@wisemen/vue-core-type-utils`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-type-utils
```

```bash [npm]
npm install @wisemen/vue-core-type-utils
```

```bash [yarn]
yarn add @wisemen/vue-core-type-utils
```
:::

## Import and use

Once installed, you can import the utility types in your TypeScript files:

```typescript
import type { DeepPartial, DeepNullable } from '@wisemen/vue-core-type-utils'

// Use in your type definitions
interface User {
  id: string
  profile: {
    name: string
    email: string
  }
}

type PartialUser = DeepPartial<User>
type NullableUser = DeepNullable<User>
```

That's it! You're ready to use the type utilities in your project.
