---
"@wisemen/vue-core-actions": minor
---

Add `tableSelection` to `ActionContext` and `useActionManagerStore`, shaped as `{ type: 'include' | 'exclude', items: string[] }`, so a data table's selection can be registered with the action manager. Adds `setTableSelection`/`clearTableSelection` to set and reset it.
