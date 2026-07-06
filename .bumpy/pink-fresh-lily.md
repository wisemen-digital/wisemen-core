---
"@wisemen/vue-core-design-system": patch
---

Add an optional `getItemKey` prop to `UIAutocomplete` and `UISelect` for supplying a stable, unique key per item (defaults to `JSON.stringify(value)` when not provided).

Also fixes `UISelect`: dropdown items were previously keyed with a random string regenerated on every render, so Vue tore down and recreated every option on any items/search/selection change instead of patching them. Item identity (for selected/non-selected matching) is now derived consistently from the same key.
