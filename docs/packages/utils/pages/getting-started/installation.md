# Installation

A quick tutorial to get started with `@wisemen/vue-core-utils`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-utils
```

```bash [npm]
npm install @wisemen/vue-core-utils
```

```bash [yarn]
yarn add @wisemen/vue-core-utils
```
:::

## Import and use

Import the utilities you need:

```typescript
import {
  ArrayUtil,
  NumberUtil,
  StringUtil,
  UuidUtil,
  assert,
  assertDefined,
  assertNever,
  Logger,
  logger,
} from '@wisemen/vue-core-utils'
```

## Quick example

```typescript
const cleanTags = ArrayUtil.unique(['new', 'featured', 'new'])
const titleSlug = StringUtil.slugify('Hello Wisemen Core')
const id = UuidUtil.generate()

assert(cleanTags.length > 0, 'At least one tag is required')

logger.info('Created item', {
  id,
  titleSlug,
  cleanTags,
})
```

Continue with the [Usage](../usage/array-util.md) pages for utility-specific examples.