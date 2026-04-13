---
"@wisemen/eslint-config-nestjs": major
---

Most linting rules have been moved from ESLint to [Oxlint](https://oxc.rs/docs/guide/usage/linter.html), a significantly faster Rust-based linter. ESLint is still used for rules that Oxlint does not yet support (e.g. certain TypeScript-ESLint, stylistic, and custom rules).

A new `.oxlintrc.json` config file is now shipped alongside the ESLint config.

`oxlint` has been added as a **peer dependency**.
