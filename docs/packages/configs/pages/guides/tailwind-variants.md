# Tailwind Variants Configuration

Configure Tailwind Variants for building flexible and type-safe component variants.

## Basic setup

```typescript
// src/config/tailwind-variants.ts
import { createTV } from 'tailwind-variants'
import { tailwindVariantsConfig } from '@wisemen/vue-core-configs'

export const tv = createTV(tailwindVariantsConfig())
```

## Common overrides

### Basic usage

```typescript
const tv = createTV(tailwindVariantsConfig())
```

### With custom configuration

```typescript
const tv = createTV(tailwindVariantsConfig({
  // Your custom options here
}))
```

## Using in components

Once configured, use the `tv` function to create component styles:

```typescript
import { tv } from '@/config/tailwind-variants'

export const button = tv({
  base: 'px-4 py-2 rounded font-medium transition',
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})
```

## Resources

- [Tailwind Variants Documentation](https://www.tailwind-variants.org/)
