# @wisemen/vue-core-design-system — Skill Spec

A Vue 3 design system built on Reka UI and Tailwind Variants. Provides 35+ UI-prefixed components, a custom design token system (spacing, colors, typography, radius, shadows), light/dark/system themes, and composables for form inputs and overlay management.

## Domains

| Domain | Description | Skills |
| ------ | ----------- | ------ |
| Setup & Theming | CSS imports, UIThemeProvider, appearance, locales, token customization | getting-started |
| Select Component | UISelect displayFn, search modes, multi-select, getItemConfig, virtual list | select-usage |
| Dialog Component | UIDialog compound pattern, useOverlay imperative control, ConfirmDialog | dialog-usage |

## Skill Inventory

| Skill | Type | Domain | Covers | Failure Modes |
| ----- | ---- | ------ | ------ | ------------- |
| Getting Started | lifecycle | Setup & Theming | style.css import, UIThemeProvider, locales, semantic tokens, source.css customization | 3 |
| Select Usage | core | Select Component | displayFn, local/remote search, multi-select, getItemConfig, virtual list | 3 |
| Dialog Usage | core | Dialog Component | Compound structure (Header/Body/Footer), ConfirmDialog, useOverlay, preventEsc | 2 |

## Failure Mode Inventory

### Getting Started (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Not importing style.css — no tokens, no component styles | CRITICAL | package.json exports |
| 2 | Missing UIThemeProvider — semantic tokens don't resolve | CRITICAL | ThemeProvider.vue |
| 3 | Using raw Tailwind spacing instead of design token scale | HIGH | tokens.css |

### Select Usage (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Omitting displayFn — runtime error | CRITICAL | Select.vue props |
| 2 | Inconsistent getItemConfig between trigger and dropdown | HIGH | Select.vue template |
| 3 | Remote search without pre-loading initial items | HIGH | useSelectRemoteSearch.ts |

### Dialog Usage (2 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Using UIDialog without compound children — loses layout/a11y | CRITICAL | Dialog.vue context |
| 2 | Not emitting 'close' from custom dialog — useOverlay promise hangs | HIGH | useOverlay.ts |
