# Browser configuration

Use `createWebBrowserTestConfig()` to standardize Vitest Browser Mode with Vue and Playwright.

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

import { createWebBrowserTestConfig } from '@wisemen/vue-core-test-utils/browser'

export default defineConfig(createWebBrowserTestConfig({
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
}))
```

The default configuration enables Chromium in headless mode and includes `src/**/*.spec.ts`. Pass `include` for a different test layout.
