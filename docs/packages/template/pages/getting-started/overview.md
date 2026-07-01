# Overview

The Wisemen project template is a Vue 3 application starter with a pre-configured stack and an opinionated folder structure. It is designed to be cloned at the start of a new project and used as the foundation for a production-grade web application.

## Stack

| Layer | Package |
|---|---|
| Framework | [Vue 3](https://vuejs.org) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Styling | [TailwindCSS](https://tailwindcss.com) |
| Router | [Vue Router](https://router.vuejs.org) |
| Translations | [vue-i18n](https://vue-i18n.intlify.dev) |
| Server state | [@tanstack/vue-query](https://tanstack.com/query/latest) |
| Client state | [Pinia](https://pinia.vuejs.org) |
| Design system | [@wisemen/vue-core-design-system](/packages/design-system/pages/getting-started/installation) |
| Actions | [@wisemen/vue-core-actions](/packages/actions/pages/getting-started/installation) |
| Permissions | [@wisemen/vue-core-permissions](/packages/permissions/pages/getting-started/installation) |
| Preferences | [@wisemen/vue-core-preferences](/packages/preferences/pages/getting-started/installation) |
| Forms | [formango](/packages/formango/guide/getting-started) |
| Schema validation | [Zod](https://zod.dev) |
| Composable utilities | [@vueuse/core](https://vueuse.org) |
| Error handling | [neverthrow](https://github.com/supermacro/neverthrow) |
| Animations | [motion-v](https://motion.dev/vue) |
| Headless UI | [reka-ui](https://reka-ui.com) |
| API client generation | [@hey-api/openapi-ts](https://heyapi.dev) |

## Application entry point

The app is bootstrapped in `src/main.ts`:

```typescript
import '@/tailwind/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import {
  i18nPlugin,
  piniaPlugin,
  routerPlugin,
  telemetryPlugin,
} from '@/plugins'

createHttpClient()
configureZod()

const app = createApp(App)

app.use(telemetryPlugin)
app.use(piniaPlugin)
app.use(routerPlugin)
app.use(i18nPlugin)
app.use(apiUtilsPlugin(vueQueryClientConfig()))

app.mount('#app')
```

The root component `src/App.vue` wraps the entire application in three providers from the design system:

- `UIConfigProvider` — supplies locale, hour cycle, number format, and other global config to all child components
- `UIThemeProvider` — applies the active appearance (light / dark / system)
- `UIApplicationProvider` — handles the loading state while the auth user is being fetched

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Vite development server |
| `pnpm build` | Type-check and build for production |
| `pnpm type-check` | Run vue-tsc without emitting |
| `pnpm lint` | Run oxlint and ESLint |
| `pnpm generate:api-client` | Generate the typed API client from the OpenAPI spec |

## Next steps

- [Project structure](../structure/project-structure) — what each folder is for and where to put new code
- [Feature modules](../structure/modules) — how features are organised into self-contained modules
- [Theming](../patterns/theming) — how to configure and generate project colors
