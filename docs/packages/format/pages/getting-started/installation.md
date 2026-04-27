# Installation

A quick tutorial to get started with `@wisemen/vue-core-format`.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-format
```

```bash [npm]
npm install @wisemen/vue-core-format
```

```bash [yarn]
yarn add @wisemen/vue-core-format
```
:::

## Import and use

Import the composables or utility classes you need:

```typescript
import {
  EmailFormatUtil,
  IbanFormatUtil,
  PersonNameFormatUtil,
  PhoneFormatUtil,
  StringFormatUtil,
  useDataFormatConfig,
  useNumberFormat,
  useStringFormat,
} from '@wisemen/vue-core-format'
```

## Quick example

```typescript
const { update } = useDataFormatConfig()
const numberFormat = useNumberFormat()
const stringFormat = useStringFormat()

update({
  locale: 'nl-BE',
})

numberFormat.format(1234.56, 2)
// '1.234,56'

stringFormat.toList(['apples', 'pears', 'bananas'])
// 'apples, pears en bananas'

EmailFormatUtil.mask('john.doe@example.com')
// 'j*******@example.com'
```

Continue with the [usage guides](../usage/configuration) for composable- and util-specific examples.
