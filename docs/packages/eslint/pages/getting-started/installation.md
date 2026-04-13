# Installation

Get started with `@wisemen/eslint-config-vue` - a comprehensive ESLint configuration for Vue.js projects.

## Prerequisites

This package requires:
- Node.js 22 or higher
- ESLint 9.x
- TypeScript 5.x
- Tailwind CSS 4.1.15 or higher (optional, for Tailwind-specific rules)

## 1. Install the package

::: code-group
```bash [pnpm]
pnpm add -D @wisemen/eslint-config-vue
```
:::

## 2. Install peer dependencies

The config requires ESLint as a peer dependency:

::: code-group
```bash [pnpm]
pnpm add -D eslint
```
:::

## 3. Create ESLint configuration

Create an `eslint.config.ts` file in your project root.

### For Projects

Use `projectConfig` for full-featured applications:

```typescript
// eslint.config.ts
import { projectConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await projectConfig()),
]
```

### For Packages/Libraries

Use `packageConfig` for npm packages and libraries (excludes project-structure rules):

```typescript
// eslint.config.ts
import { packageConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await packageConfig()),
]
```

### With Custom Options

Both configs accept optional configuration:

```typescript
// eslint.config.ts
import { projectConfig } from '@wisemen/eslint-config-vue'

export default [
  ...(await projectConfig({
    localesFolderPath: './src/locales/*.json',
    tailwindConfigPath: './src/assets/styles/index.css',
    tailwindRootFontSize: 16,
  })),
  {
    rules: {
      // Add your custom rules here
      'no-console': 'warn',
    },
  },
]
```

## 4. Add scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## 5. Configure your IDE

### VS Code

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add this to your `.vscode/settings.json`:

```json
{
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## What's Included?

### Both Configs Include:

- **Vue.js**: Best practices and Vue 3 composition API patterns
- **TypeScript**: Type-safe coding patterns
- **Accessibility**: Vue.js accessibility rules
- **Imports**: Import ordering and formatting
- **Code Quality**: Code style, formatting, and best practices
- **Tailwind CSS**: Class ordering and validation
- **i18n**: Vue i18n best practices
- **Vitest**: Testing rules and patterns

### `projectConfig` Additionally Includes:

- **Project Structure**: File and folder naming conventions
- **Module Independence**: Enforces module boundaries in projects

## Troubleshooting

### ESLint not finding files

Make sure your ESLint configuration is in the project root and your files match the default glob patterns. You can specify files explicitly:

```bash
eslint src/**/*.{js,ts,vue}
```

## Next Steps

- Explore the [ESLint Inspector](/eslint-inspector/) to visualize and understand the rules
- Customize rules based on your project needs

## Need Help?

- [Report issues](https://github.com/wisemen-digital/wisemen-core/issues)
- [View source code](https://github.com/wisemen-digital/wisemen-core/tree/main/packages/eslint-config)
