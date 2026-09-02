# Changelog



## 2.1.6
<sub>2026-08-27</sub>

- [#1615](https://github.com/wisemen-digital/wisemen-core/pull/1615)  *(patch)* Thanks [@app/ernest-app](https://github.com/app/ernest-app)! - Resolve npm vulnerabilities (handlebars, mailpit-api, js-yaml, dayjs, fastify, @typescript-eslint/parser)

## 2.1.5
<sub>2026-08-05</sub>

- [#1546](https://github.com/wisemen-digital/wisemen-core/pull/1546)  *(patch)* Thanks [@Robbe95](https://github.com/Robbe95)! - Bumped linter dependencies + adapter rules to usecases of company

## 2.1.4

<sub>2026-06-05</sub>

- [#1208](https://github.com/wisemen-digital/wisemen-core/pull/1208) _(patch)_ Thanks [@Robbe95](https://github.com/Robbe95)! - Small readme change

## 2.1.3

### Patch Changes

- [#896](https://github.com/wisemen-digital/wisemen-core/pull/896) [`3e890c0`](https://github.com/wisemen-digital/wisemen-core/commit/3e890c027d670821eec9ed8e559c24e50d4d79e9) Thanks [@Robbe95](https://github.com/Robbe95)! - Added option to disable tailwind on package linting

## 2.1.2

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

- Updated dependencies [[`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a)]:
  - @wisemen/eslint-plugin-vue@0.1.1

## 2.1.1

### Patch Changes

- [#665](https://github.com/wisemen-digital/wisemen-core/pull/665) [`8f075e2`](https://github.com/wisemen-digital/wisemen-core/commit/8f075e27d9d3c637ea633f5e36f72fb53362287f) Thanks [@Robbe95](https://github.com/Robbe95)! - Updated linter

## 2.1.0

### Minor Changes

- f5bddce: JSON sorting

### Patch Changes

- f5bddce: Ran updated linter
- fce3eff: Implemented new computed / ref rule
- f5bddce: Removed generics from computed / ref
- Updated dependencies [fce3eff]
  - @wisemen/eslint-plugin-vue@0.1.0

## 2.0.0

### Major Changes

- 8c3d962: - Added separate configs for package / projects
  - Better tailwindcss v4, with canonical classes support
  - Updated packages

### Patch Changes

- cfa9ee9: Updated dependencies
- 41e6b97: - Allow AppProviders.vue on source
  - Allow test files in util folder, e.g. /src/util/address/address.util.spec.ts
  - Allow {camelCase}.composable.ts and {camelCase}.composable.spec.ts files on root of composables folder
  - Name of composables don't need to match folder name anymore
  - Allow {camelCase}.routes.ts files in routes folder
  - Allow import @tests/ in encapsulated folders
  - Improved encapsulated folder detection logic
  - Allow inter use-case imports in module folders
- 347cf1a: Better date sorting
- 347cf1a: Bumped dependency versions

## 1.7.6

### Patch Changes

- 02c19e6: Added names for eslint configs

## 1.7.5

### Patch Changes

- 1afc3e2: Allow imports from the /tests folder on root
- **Project structure:** Allow .props.ts files in components folder to tightly couple it. (I did it wrong previously, so this is a fix for that)

## 1.7.1

### Patch Changes

- Project structure: Allow .props.ts files in models folder to tightly couple it.

## 1.7.0

### Minor Changes

- Refactor to TS files: Refactored project to use TS files.
- Project structure: Updated structure rules to be more flexible.

## 1.6.0

### Minor Changes

- Project structure: Enforced project structure.
- Module encapsulation: Enforced module encapsulation.
- Path: Updated path rules package to flat config.
- Wisemen: Made custom rules package. Enabled rule explicit-function-return-type-with-regex and made it so composables do not require a return type.

## 1.5.1

### Patch Changes

- Tailwindcss: enforce-consistent-variable-syntax rule ignores classes with custom-.

## 1.5.0

### Minor Changes

- Tailwindcss: enforce-consistent-variable-syntax rule enabled.
- Chore: Updated all packages to latest versions.

## 1.4.0

### Minor Changes

- Tailwindcss: Updated to eslint-plugin-better-tailwind, enabling conflicted classes and unregistered classes rules.

## 1.2.0

### Minor Changes

- Rules: Removed all putout rules and refactored them to different ones.
- Formatting: Formatting for CSS files.

## 1.1.0

### Minor Changes

- Readable tailwind: Added readable tailwind rules.

## 1.0.0

### Major Changes

- Updated packages: Updated all packages to latest.
- A11y rules: Added a11y rules.

## 1.0.0-next.1

### Patch Changes

- Updated packages: Updated all packages to latest.
- Updated putout: Uses flat config.
- Updated perfectionist: Uses regex for pattern matching.
- Disabled Tailwind: Disabled Tailwind rules, not updated to 4.0.
- Tests: Added tests for spacing and perfectionist rules.
- Unicorn: Added unicorn rules.
  - catch-error-name
  - consistent-destructuring
  - consistent-empty-array-spread
  - consistent-existence-index-check
  - error-message
  - expiring-todo-comments
  - explicit-length-check
  - no-accessor-recursion
  - no-anonymous-default-export
  - no-array-for-each
  - no-array-method-this-argument
  - no-array-push-push
  - no-await-expression-member
  - no-await-in-promise-methods
  - no-empty-file
  - no-for-loop
  - no-nested-ternary
  - no-single-promise-in-promise-methods
  - no-unnecessary-await
  - no-unreadable-array-destructuring
  - no-useless-fallback-in-spread
  - no-useless-length-check
  - no-useless-switch-case
  - no-useless-undefined
  - number-literal-case
  - numeric-separators-style
  - prefer-array-find
  - prefer-array-flat
  - prefer-array-flat-map
  - prefer-array-index-of
  - prefer-array-some
  - prefer-at
  - prefer-date-now
  - prefer-includes
  - prefer-logical-operator-over-ternary
  - prefer-math-min-max
  - prefer-set-has
  - prefer-set-size
  - prefer-switch
  - template-indent
  - throw-new-error

## 0.2.3

### Patch Changes

- Fix typescript: Typescript to true in factory.

## 0.2.2

### Patch Changes

- Max depth: Added rule to enforce max depth of 3.
- No nested turnary: Added rule to enforce no nested ternary, which I hope does not happen already.

## 0.2.1

### Patch Changes

- Type rules: Removed type rules, it has performance issues with large projects.
- Packages: Updated packages to latest versions.
- Consistent function scoping: Added rule to enforce consistent function scoping.

## 0.2.0

### Minor Changes

- Updated packages: Updated packages to latest versions.
- Ordening: Added sorting for unions.
- Ordening: Do not ignore casing for sorting. Example: A, B, a, b instead of A, a, B, b.
- Type rules: Reenabled type rules.
- Function scoping: Added function scoping rule.
- Consistent chaining: Added consistent chaining rule.
- Cypress removed: Removed cypress rules.
- Putout removed: Removed unnecessary putout rules.
- Vitest: Added vitest rules.

## 0.1.3

### Patch Changes

- Tailwind: Allow classes starting with custom- in tailwind.

## 0.1.2

### Patch Changes

- Ordening: Removed ordening from objects named variants, as it is of functional significance in style libraries like cva.
- Ordening: Moved name before unknown in object ordering.
- Imports: Disabled rule that requires file extensions in imports as it does not work with dots in the file name.

## 0.1.1

### Patch Changes

- Ordening: Added ordering rules for routes declaration.

## 0.1.0

### Minor Changes

- Upgrade: Upgraded to eslint 9.3 and updated dependencies.
- Tailwind: Added eslint-tailwind flat config support.
- Chore: Removed unused eslint-import dependency.

## 0.0.18

### Patch Changes

- Imports: Added rule that requires file extensions in imports.
- Parens: Added rule that requires parens around arrow function arguments.

## 0.0.17

### Patch Changes

- Ordening: Added uuid ordering and better date matching.
- Fix: Disabled putout rule that was causing problems.

## 0.0.16

### Patch Changes

- Refactor: Split rules in different files.
- Fix: Re-added return type.

## 0.0.15

### Patch Changes

- Imports: Require absolute imports for anything above 1 depth.

## 0.0.12

### Patch Changes

- 9.0 upgrade: Upgraded to eslint 9.0.
- I18n: Vue-i18n to flat config.

## 0.0.11

### Patch Changes

- Sorting: Better object, interface and type sorting.
- Spacing: Moved some spacing rules from putout to default style linting.
- Grouping: Grouped rules a bit better with flatconfig.
