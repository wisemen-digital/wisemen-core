# Installation

Get started with `@wisemen/vue-core-configs` in your Vue 3 project.

## Install the package

::: code-group
```bash [pnpm]
pnpm install @wisemen/vue-core-configs
```

```bash [npm]
npm install @wisemen/vue-core-configs
```

```bash [yarn]
yarn add @wisemen/vue-core-configs
```
:::

## Install peer dependencies

`@wisemen/vue-core-configs` requires peer dependencies for the specific configurations you use. Install the ones you need:

::: code-group
```bash [pnpm - All]
pnpm install -D \
  @hey-api/openapi-ts \
  @tanstack/vue-query \
  @vitejs/plugin-vue \
  tailwind-variants \
  vite \
  vite-plugin-pwa \
  vue \
  vue-i18n \
  zod
```

```bash [pnpm - Minimal]
pnpm install -D vite @vitejs/plugin-vue vue
```
:::

## Quick start

Import and use the configurations you need:

```typescript
// vite.config.ts
import { viteConfig, vitePwaConfig } from '@wisemen/vue-core-configs'

export default viteConfig({
  // Your overrides here
})
```


## Available configurations

Choose the guides that match your setup:

- [Vite Configuration](../guides/vite)
- [API Code Generation (Hey-API)](../guides/hey-api)
- [Data Validation (Zod)](../guides/zod)
- [Query Management (Vue Query)](../guides/vue-query)
- [Internationalization (Vue I18n)](../guides/vue-i18n)
- [UI Variants (Tailwind Variants)](../guides/tailwind-variants)
