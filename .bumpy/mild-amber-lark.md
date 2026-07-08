---
"@wisemen/vue-core-design-system": minor
---

`DashboardSidebarNavLink` is now the union of two explicit shapes, both exported from `@wisemen/vue-core-design-system`:

- **`SidebarNavLinkItem`** — a link that navigates directly to a route. Requires `to`, has no `subItems`.
- **`SidebarNavSubItemsItem`** — a link that expands into sub-items. Requires `subItems`, has no `to`.

Each shape also accepts an optional `type` discriminator (`'link'` or `'sub-items'`) for clearer intent and stricter narrowing, but it is not required — existing nav link objects keep working as-is:

```ts
const links: DashboardSidebarNavLink[] = [
  { type: 'link', label: 'Dashboard', icon: DashboardIcon, to: { path: '/' } },
  { type: 'sub-items', label: 'Reports', icon: ReportsIcon, subItems: [...] },
]
```
