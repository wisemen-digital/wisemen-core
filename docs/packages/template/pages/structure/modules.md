# Feature modules

Each feature in the application lives in its own module under `src/modules/`. A module is a self-contained vertical slice: it owns its API calls, domain models, UI, routing, and actions. Nothing from one module reaches into another module's internals — communication happens through each module's public `index.ts`.

The template ships with several pre-built modules:

| Module | Description |
|---|---|
| `auth` | Login, logout, OAuth callback, and the authenticated user store |
| `contact` | Example CRUD module — used as the reference for building new features |
| `event-log` | Activity / audit log |
| `global-search` | Application-wide command menu search |
| `permission` | Permission metadata used by action guards |
| `preferences` | User preferences dialog and store |
| `role` | User role management |
| `user` | User management |

## Module structure

The `contact` module is the canonical example:

```
modules/contact/
├── actions/
│   ├── contactActionModels.ts
│   ├── contactCreateDialog.action.ts
│   ├── contactDeleteDialog.action.ts
│   └── contactUpdateDialog.action.ts
├── api/
│   ├── contact.queryKeys.ts
│   ├── contact.service.ts
│   ├── mutations/
│   │   ├── contactCreate.mutation.ts
│   │   ├── contactDelete.mutation.ts
│   │   └── contactUpdate.mutation.ts
│   └── queries/
│       ├── contactDetail.query.ts
│       └── contactIndex.query.ts
├── models/
│   └── contact/
│       ├── contactUuid.model.ts
│       ├── create/
│       │   ├── contactCreate.transformer.ts
│       │   └── contactCreateForm.model.ts
│       ├── detail/
│       │   ├── contactDetail.model.ts
│       │   └── contactDetail.transformer.ts
│       ├── index/
│       │   ├── contactIndex.model.ts
│       │   ├── contactIndex.transformer.ts
│       │   ├── contactIndexQueryParams.model.ts
│       │   └── contactIndexQueryParams.transformer.ts
│       └── update/
│           ├── contactUpdate.transformer.ts
│           └── contactUpdateForm.model.ts
├── use-cases/
│   ├── create/
│   │   └── views/
│   │       └── ContactCreateFormDialog.vue
│   ├── overview/
│   │   ├── components/
│   │   │   ├── ContactOverviewTable.vue
│   │   │   └── …
│   │   ├── composables/
│   │   │   ├── contactOverviewColumns.composable.ts
│   │   │   └── contactOverviewFilters.composable.ts
│   │   └── views/
│   │       └── ContactOverviewView.vue
│   └── update/
│       └── views/
│           └── ContactUpdateFormDialog.vue
├── contact.routes.ts
└── index.ts
```

---

### actions/

Action definitions for this module. Each action is a composable that returns a configured action object. The `contactActionModels.ts` file declares the TypeScript interface describing the data shape the actions operate on:

```typescript
interface ContactActionModel extends ContactIndex {
  key: string
  modelName: 'Contact'
}

export interface ContactActionModels {
  Contact: ContactActionModel
}
```

This interface is imported into `src/actions/actions.type.ts` to build the global action model union. For further details on defining and registering actions, see the [@wisemen/vue-core-actions docs](/packages/actions/pages/getting-started/installation).

---

### api/

All server communication for the module:

- `contact.service.ts` — static methods for each API endpoint, each returning a typed `ApiResult`
- `contact.queryKeys.ts` — TanStack Query key factory, shared by queries and mutations for cache invalidation
- `queries/` — one file per read operation, each exporting a `useQuery` composable
- `mutations/` — one file per write operation, each exporting a `useMutation` composable

---

### models/

Domain models, Zod schemas, and transformers. Models are split by operation (create, update, detail, index) to avoid mixing concerns.

UUIDs are branded types derived from a Zod schema:

```typescript
export const contactUuidSchema = z.uuid().brand('ContactUuid')
export type ContactUuid = z.infer<typeof contactUuidSchema>
```

Each operation folder contains:

- A **model** file — the TypeScript type derived from the Zod schema (or defined manually)
- A **transformer** file — functions that convert between the API DTO and the domain model

---

### use-cases/

Views and the components that support them, organised by use case (overview, create, update, detail, …). Each use case folder has:

- `views/` — page-level Vue components registered as routes
- `components/` — components used only within this use case
- `composables/` — composables used only within this use case

---

### `<name>.routes.ts`

Route definitions for the module. Routes are created with `createRoutes` from `@repo/router` and imported into the appropriate route group in `src/routes/`.

```typescript
export const contactRoutes = createRoutes([
  {
    name: 'contact-module',
    path: 'contacts',
    redirect: { name: 'contact-overview' },
    children: [
      {
        name: 'contact-overview',
        path: '',
        component: () => import('./use-cases/overview/views/ContactOverviewView.vue'),
        meta: {
          permission: 'contact.read',
        },
      },
    ],
  },
])
```

---

### `index.ts`

The public API of the module. Only export what other parts of the app are allowed to import:

```typescript
export * from './actions/contactActionModels'
export * from './api/contact.queryKeys'
export * from './contact.routes'
```

Anything not exported from `index.ts` is internal to the module.

---

## Adding a new module

1. Create `src/modules/<name>/` with the folder structure above.
2. Add routes to the appropriate group in `src/routes/`.
3. If the module has actions, add its `ActionModels` interface to `src/actions/actions.type.ts`.
4. Export only the public surface from `index.ts`.
