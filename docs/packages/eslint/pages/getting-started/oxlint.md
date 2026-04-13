# Oxlint Integration

Supercharge your linting workflow by combining ESLint with Oxlint - a high-performance linter written in Rust that's significantly faster than ESLint for basic checks.

## What is Oxlint?

[Oxlint](https://oxc.rs/docs/guide/usage/linter.html) is a blazingly fast JavaScript/TypeScript linter that can run hundreds of times faster than ESLint. By using Oxlint for quick checks and ESLint for more complex analysis, you get the best of both worlds: speed and comprehensive linting.

## Benefits

- ⚡ **Faster Linting**: Oxlint can be 50-100x faster than ESLint for supported rules
- 🔄 **Complementary**: Use Oxlint for quick feedback, ESLint for deep analysis
- 🎯 **Targeted**: Oxlint focuses on common errors and code quality issues
- 🚀 **CI/CD Optimization**: Run Oxlint first for fast feedback, then ESLint for thorough checks

## Installation

### 1. Install Oxlint Plugin

Add the ESLint Oxlint plugin to your project:

::: code-group
```bash [pnpm]
pnpm add -D eslint-plugin-oxlint
```

```bash [npm]
npm install --save-dev eslint-plugin-oxlint
```

```bash [yarn]
yarn add -D eslint-plugin-oxlint
```
:::

### 2. Generate Oxlint Configuration

Create an `.oxlintrc.json` file by migrating your ESLint configuration:

::: code-group
```bash [pnpm]
pnpm oxlint:migrate
```

```bash [Manual]
pnpx @oxlint/migrate eslint.config.js --with-nursery --merge
```
:::

This command:
- Analyzes your `eslint.config.js`
- Extracts rules that Oxlint supports
- Creates an `.oxlintrc.json` configuration
- Includes nursery rules (experimental but useful rules)
- Merges with any existing Oxlint configuration

### 3. Update ESLint Configuration

Import and integrate Oxlint with your ESLint config:

```typescript
// eslint.config.ts
import oxlint from 'eslint-plugin-oxlint'
import wisemenConfig from '@wisemen/eslint-config-vue'

export default [
  ...(await wisemenConfig),
  // Load Oxlint rules from .oxlintrc.json
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
]
```

This configuration:
- Disables ESLint rules that overlap with Oxlint
- Prevents duplicate linting of the same issues
- Ensures ESLint and Oxlint work harmoniously together

## Usage

### Recommended Scripts

Add these scripts to your `package.json` for an optimized linting workflow:

```json
{
  "scripts": {
    "lint:oxlint": "oxlint . --fix",
    "lint:eslint": "eslint . --fix --cache",
    "lint": "pnpm lint:oxlint && pnpm lint:eslint",
    "oxlint:migrate": "pnpx @oxlint/migrate eslint.config.js --with-nursery --merge"
  }
}
```

### Running Linters

#### Fast Check with Oxlint

Run Oxlint for quick feedback during development:

```bash
pnpm lint:oxlint
```

This will:
- Check your code extremely quickly
- Auto-fix simple issues
- Catch common errors and anti-patterns

#### Comprehensive Check with ESLint

Run ESLint for thorough analysis:

```bash
pnpm lint:eslint
```

This will:
- Perform deep code analysis
- Check Vue.js specific patterns
- Validate TypeScript types
- Enforce project-specific rules
- Use cache for faster subsequent runs

#### Full Lint (Recommended)

Run both linters in sequence:

```bash
pnpm lint
```

This workflow:
1. Runs Oxlint first for fast fixes
2. Then runs ESLint for comprehensive checks
3. Provides the best balance of speed and thoroughness

## Configuration

### Oxlint Configuration File

The `.oxlintrc.json` file controls Oxlint's behavior:

```json
{
  "rules": {
    "no-console": "warn",
    "no-debugger": "error"
  },
  "env": {
    "browser": true,
    "es2021": true
  }
}
```

### Updating Oxlint Rules

When you update your ESLint configuration, regenerate the Oxlint config:

```bash
pnpm oxlint:migrate
```

This ensures Oxlint stays in sync with your ESLint rules.

## IDE Integration

### VS Code

1. Install the [Oxlint extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
2. Configure in `.vscode/settings.json`:

## Further Reading

- [Oxlint Official Documentation](https://oxc.rs/docs/guide/usage/linter.html)
- [eslint-plugin-oxlint](https://github.com/oxc-project/eslint-plugin-oxlint)

## Need Help?

- [Report issues](https://github.com/wisemen-digital/wisemen-core/issues)
- [View source code](https://github.com/wisemen-digital/wisemen-core/tree/main/packages/eslint-config)
