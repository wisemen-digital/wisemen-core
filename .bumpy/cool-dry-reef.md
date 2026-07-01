---
"@wisemen/vue-core-filters": minor
---

- Add `DATE` filter type — use `createDateFilter` to let users pick a single `Temporal.PlainDate` via a dialog.
- Rename `isStatic` to `isPersistent` on all filter types. Persistent filters are always shown in `activeFilters`, cannot be removed by `clearFilter` or `clearAll`, and are sorted before non-persistent filters with a visual separator.
- Persistent `date` and `date-range` badges now show prev/next navigation arrows and a "Today" action (keyboard shortcuts `←`, `→`, `T`). The navigation step is inferred from the selected range (day / week / month / year / custom).
