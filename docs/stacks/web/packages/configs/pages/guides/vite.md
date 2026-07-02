# Vite Configuration

Pre-configured Vite setup optimized for Vue 3 applications with intelligent bundling strategies.

## Basic usage

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { viteConfig } from '@wisemen/vue-core-configs'

export default defineConfig((config) => {
  return viteConfig({
    envConfig: {
      BUILD_COMMIT: process.env.BUILD_COMMIT ?? 'undefined',
      BUILD_NUMBER: process.env.BUILD_NUMBER ?? '0',
      mode: config.mode,
    },
  })
})
```

## Common overrides

### With custom path aliases

```typescript
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig((config) => {
  return viteConfig({
    envConfig: {
      BUILD_COMMIT: process.env.BUILD_COMMIT ?? 'undefined',
      BUILD_NUMBER: process.env.BUILD_NUMBER ?? '0',
      mode: config.mode,
    },
    overrides: {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@tests': path.resolve(__dirname, './tests'),
        },
      },
    },
  })
})
```

### With additional plugins

```typescript
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { viteConfig, vitePwaConfig } from '@wisemen/vue-core-configs'

export default defineConfig((config) => {
  return viteConfig({
    envConfig: {
      BUILD_COMMIT: process.env.BUILD_COMMIT ?? 'undefined',
      BUILD_NUMBER: process.env.BUILD_NUMBER ?? '0',
      mode: config.mode,
    },
    plugins: [
      vue(),
      VitePWA(vitePwaConfig()),
    ],
  })
})
```