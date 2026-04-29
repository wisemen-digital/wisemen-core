# @wisemen/vue-core-components — Skill Spec

A Vue 3 component library built on Reka UI and Tailwind Variants. Provides 40+ compound components with consistent theming via a class variant system, global configuration through VcConfigProvider, and composables for pagination, keyboard shortcuts, and dialog management.

## Domains

| Domain | Description | Skills |
| ------ | ----------- | ------ |
| Setup & Theming | VcConfigProvider, style.css import, extendIcons, defineComponentVariant, classConfig | config-setup |
| Data Tables | VcTable compound, usePagination with route sync, PaginationParamsBuilder | table-usage |
| Form Inputs | VcFormField wrapping, formango toFormField integration, input components | form-field-usage |
| Overlays & Feedback | VcDialog compound, useDialog imperative control, VcToastContainer, useToast | dialog-toast-usage |

## Skill Inventory

| Skill | Type | Domain | Covers | Failure Modes |
| ----- | ---- | ------ | ------ | ------------- |
| Config & Setup | lifecycle | Setup & Theming | style.css import, VcConfigProvider, extendIcons module augmentation, defineComponentVariant, classConfig | 3 |
| Table Usage | core | Data Tables | VcTable compound (Root/ScrollContainer/Content/Header/HeaderCell/Body/Row/Cell), usePagination, PaginationParamsBuilder, sortable columns, sticky columns | 3 |
| Form Field Usage | core | Form Inputs | VcFormField parts (Root/Label/Error/Hint), toFormField helper, all input components (text/number/select/date/checkbox/radio/switch), formango integration | 3 |
| Dialog & Toast Usage | core | Overlays & Feedback | VcDialog convenience + compound parts, useDialog with VcDialogContainer, useToast (success/error/info), VcToastContainer | 3 |

## Failure Mode Inventory

### Config & Setup (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Not importing style.css — components render unstyled | CRITICAL | package.json exports |
| 2 | Missing VcConfigProvider — composables throw missing context | CRITICAL | VcConfigProvider.vue |
| 3 | Using raw class instead of classConfig — only targets root element | HIGH | classVariant.type.ts |

### Table Usage (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Missing gridTemplateColumns — table layout broken | CRITICAL | VcTableRoot.vue |
| 2 | Not syncing pagination to route query — state lost on navigation | HIGH | pagination.composable.ts |
| 3 | Mismatched column count between template and cells | HIGH | CSS grid behaviour |

### Form Field Usage (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Not wrapping inputs in VcFormField — no label/error/hint | CRITICAL | VcFormField.vue |
| 2 | Binding formango fields incorrectly — not using toFormField | HIGH | Field interface |
| 3 | Forgetting displayFn on VcSelect — runtime error | HIGH | VcSelect.vue |

### Dialog & Toast Usage (3 failure modes)

| # | Mistake | Priority | Source |
| --- | ------- | -------- | ------ |
| 1 | Missing VcToastContainer — toast calls silently fail | CRITICAL | toast store |
| 2 | Not rendering VcDialogContainer for useDialog | HIGH | dialog component |
| 3 | Using compound parts without VcDialogPortal — z-index issues | HIGH | VcDialog.vue |
