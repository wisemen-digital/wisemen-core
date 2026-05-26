# Naming conventions

| Type | Convention | Example |
|---|---|---|
| Folders | kebab-case | `use-cases/`, `query-keys/` |
| Vue components | PascalCase | `ContactOverviewView.vue` |
| TypeScript files | camelCase + dot suffix | `contactIndex.model.ts` |

TypeScript files use a dot-separated suffix that describes the file's role: `.model.ts`, `.transformer.ts`, `.service.ts`, `.query.ts`, `.mutation.ts`, `.composable.ts`, `.action.ts`, `.routes.ts`, `.util.ts`.
