---
"@wisemen/vue-core-filters": minor
---

Add an opt-in `persistInUrl` option to `useFilters`, so filter values can be synced to a URL query string and survive a page refresh or a shared link.

```typescript
useFilters({
  actionGroup: { /* ... */ },
  filters: [ /* ... */ ],
  persistInUrl: true, // or a custom query key, e.g. 'contact-filters'
})
```

Disabled by default — existing `useFilters` calls are unaffected.
