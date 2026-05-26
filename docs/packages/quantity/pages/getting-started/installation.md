# Installation

A quick tutorial to get started with `@wisemen/vue-core-quantity`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-quantity @wisemen/quantity
```

```bash [npm]
npm install @wisemen/vue-core-quantity @wisemen/quantity
```

```bash [yarn]
yarn add @wisemen/vue-core-quantity @wisemen/quantity
```
:::

`@wisemen/vue-core-quantity` contains frontend-friendly quantity models. Unit enums and DTO classes are provided by `@wisemen/quantity`, so install both packages when application code imports units or DTOs directly.

## Import and use

Import the model from `@wisemen/vue-core-quantity` and the matching unit enum from `@wisemen/quantity`:

```typescript
import { Distance } from '@wisemen/vue-core-quantity'
import { DistanceUnit } from '@wisemen/quantity'
```

## Quick example

```typescript
const distance = new Distance(1500, DistanceUnit.METER)

distance.getValueIn(DistanceUnit.KILOMETER)
// 1.5

distance.toString(DistanceUnit.KILOMETER)
// '1.5 km'

distance.toDto()
// { value: 1500, unit: 'm' }
```

Continue with the [usage guides](../usage/overview) for model-specific examples.
