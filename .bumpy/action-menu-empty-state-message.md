---
"@wisemen/vue-core-actions": minor
"@wisemen/vue-core-design-system": minor
---

Add configurable empty-state messages for sub-action menus

`searchSubActionsConfig` now accepts `emptyMessage` and `noResultsMessage` to customize the text shown when a sub-action list has no items or a search query yields no matches. Both accept a plain `string` or a function, and fall back to a generic message when omitted.

Action menus (`ActionDropdownMenuContent`, `ActionContextMenuContent`, `CommandMenu`) also now distinguish between "no actions available" and "no matching actions for this search" states, each with its own default translation.
