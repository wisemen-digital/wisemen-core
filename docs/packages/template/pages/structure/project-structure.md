# Project structure

All application source lives under `src/`. This page walks through each top-level folder, explains what belongs there, and notes any conventions worth knowing.

```
src/
├── main.ts
├── App.vue
├── AppActionsRegistrar.vue
├── actions/
├── api/
├── assets/
├── client/
├── composables/
├── configs/
├── constants/
├── instances/
├── libs/
├── locales/
├── middlewares/
├── models/
├── modules/
├── plugins/
├── routes/
├── tailwind/
├── themes/
├── types/
├── ui/
└── utils/
```

---

## actions/

Global actions that apply across the entire application, regardless of which module is active. Examples: navigate to settings, open the preferences dialog, sign out.

```
actions/
├── actions.type.ts      # AppActionContext and AppMetadata types
└── global/              # Individual global action composables
```

`actions.type.ts` defines the union of all action model maps from every module. Every action in the app is typed against this file. See the [@wisemen/vue-core-actions docs](/packages/actions/pages/getting-started/installation) for the full actions pattern.

Global actions are registered in `AppActionsRegistrar.vue`, which calls `useActionRegistryStore().registerActions(...)` once on mount.

Module-specific actions live inside their respective module under `modules/<name>/actions/`. See [Feature modules](./modules) for details.

---

## api/

API utilities that do not belong to any specific module. Organised by namespace, following the same structure as module-level API folders:

```
api/
└── <namespace>/
    ├── <namespace>.service.ts
    ├── queries/
    │   └── <namespace>QueryName.query.ts
    └── mutations/
        └── <namespace>MutationName.mutation.ts
```

---

## assets/

Static assets bundled by Vite, e.g. `images/`. Import these with the `@/assets/` alias.

---

## client/

Auto-generated typed fetch client, Zod schemas, and TypeScript types. Do not edit by hand. See [API client](./api-client) for setup and configuration.

---

## composables/

Shared Vue composables that are used by more than one module. If a composable is only used within a single module, keep it inside that module's folder instead.

---

## configs/

Application-level configuration that wires together third-party libraries. Currently contains `zod.config.ts`, which connects the Zod error formatter to the active vue-i18n instance so validation messages are localised automatically.

---

## constants/

Application-wide constants. `env.const.ts` exports all environment variables read from `import.meta.env`:

```typescript
export const API_BASE_URL = import.meta.env.API_BASE_URL
export const AUTH_BASE_URL = import.meta.env.AUTH_BASE_URL
// …
```

Always import environment variables from this file rather than reading `import.meta.env` directly. This gives you a single place to audit what environment variables the app depends on.

---

## libs/

Thin wrappers or factory functions around external libraries. For example, the HTTP client factory (`httpClient.lib.ts`) that creates and configures the Fetch instance used by the generated API client.

---

## locales/

Translation files for vue-i18n.

```
locales/
├── en-US.json   # App-specific translation keys
└── index.ts     # Merges app translations with package translations
```

`index.ts` merges the app's own `en-US.json` with the built-in translations exported by each `@wisemen/vue-core-*` package:

```typescript
export const translations = {
  'en-US': {
    ...enUsJson,
    ...uiLocales['en-US'],
    ...preferencesLocales['en-US'],
    ...actionsLocales['en-US'],
    // …
  },
}
```

Add new translation keys to `en-US.json`. To add a new locale, add a matching JSON file and include it in the `translations` object.

---

## middlewares/

Vue Router navigation middleware. Each middleware is a function created with `MiddlewareUtil.createMiddleware` from `@repo/router`. Middleware is attached to routes via the `meta.middleware` field.

`auth.middleware.ts` checks whether the user is authenticated on every navigation to a protected route. If the session has expired it redirects to the login page.

---

## models/

Shared domain models that are used by more than one module — typically `user` and `user-role`. Models that belong to a single module live inside that module's `models/` folder instead.

---

## modules/

Feature modules. Each module is a self-contained vertical slice of the application. See [Feature modules](./modules) for the full structure.

---

## plugins/

Vue plugin instances, one file per plugin:

| File | Plugin |
|---|---|
| `router.plugin.ts` | Vue Router — registers routes and wires up route middleware |
| `i18n.plugin.ts` | vue-i18n — sets the default locale and merges all translations |
| `pinia.plugin.ts` | Pinia — creates the store instance |
| `telemetry.plugin.ts` | OpenTelemetry tracing via `@wisemen/vue-core-telemetry` |

`index.ts` re-exports all plugins for a single import in `main.ts`.

---

## routes/

Top-level route definitions, split by authentication context:

| File | Purpose |
|---|---|
| `routes.ts` | Root — composes all route groups |
| `workspace.routes.ts` | Authenticated routes (protected by `authMiddleware`) |
| `unauthenticated.routes.ts` | Public routes — login, callback, 404 fallback |
| `settings.routes.ts` | Settings section routes |

Each module contributes its own routes via a `<name>.routes.ts` file inside the module folder. Those route arrays are imported here and spread into the appropriate group.

---

## tailwind/

Tailwind configuration and generated CSS output. `style.css` is imported in `main.ts`. Theme files at `src/tailwind/themes/[theme].css` are auto-generated from `src/themes/[theme].json` — run `vue-gen generate-styles` to (re)generate them. Do not edit these CSS files manually.

---

## themes/

Project color configuration. See [Theming](../patterns/theming).

---

## types/

TypeScript declaration files and module augmentations:

| File | Purpose |
|---|---|
| `env.d.ts` | Declares `import.meta.env` variable types |
| `i18n.d.ts` | Augments vue-i18n with the project's translation key types |
| `vueRouter.ts` | Augments Vue Router's `RouteMeta` with `permission` and `middleware` fields |

---

## ui/

Shared project-specific UI components that are used across multiple modules. If a component is only used within a single module, keep it inside that module instead.

---

## utils/

Pure utility functions with no Vue or business-logic dependencies. If a utility is specific to one module, keep it in that module instead.
