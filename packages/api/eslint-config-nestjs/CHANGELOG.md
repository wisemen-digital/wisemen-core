# @wisemen/eslint-config-nestjs

## 1.1.0

### Minor Changes

- [#856](https://github.com/wisemen-digital/wisemen-core/pull/856) [`a91470f`](https://github.com/wisemen-digital/wisemen-core/commit/a91470f06ee1249add4d769c980e2eeed6c10e94) Thanks [@senne-vanreusel](https://github.com/senne-vanreusel)! - Modify Custom rules to be oxc compatible

## 1.0.0

### Major Changes

- Most linting rules have been moved from ESLint to [Oxlint](https://oxc.rs/docs/guide/usage/linter.html), a significantly faster Rust-based linter. ESLint is still used for rules that Oxlint does not yet support (e.g. certain TypeScript-ESLint, stylistic, and custom rules).

  A new `.oxlintrc.json` config file is now shipped alongside the ESLint config.

  `oxlint` has been added as a **peer dependency**.

## 0.2.13

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 0.2.12

### Patch Changes

- [#800](https://github.com/wisemen-digital/wisemen-core/pull/800) [`cb5275e`](https://github.com/wisemen-digital/wisemen-core/commit/cb5275e6748309330a196bd8411348be87efe4a9) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - chore: bump eslint-plugin-import-x

## 0.2.11

### Patch Changes

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies
