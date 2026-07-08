---
"@wisemen/vue-core-design-system": major
---

**Breaking:** `DashboardSidebarNavLink` is now a discriminated union. Each nav link requires a `type` field.

`DashboardSidebarNavLink` is the union of two explicit shapes, both exported from `@wisemen/vue-core-design-system`:

- **`SidebarNavLinkItem`** (`type: 'link'`) — a link that navigates directly to a route. Requires `to`, has no `subItems`.
- **`SidebarNavSubItemsItem`** (`type: 'sub-items'`) — a link that expands into sub-items. Requires `subItems`, has no `to`.

Add the `type` discriminator to every nav link object:

```ts
const links: DashboardSidebarNavLink[] = [
  { type: 'link', label: 'Dashboard', icon: DashboardIcon, to: { path: '/' } },
  { type: 'sub-items', label: 'Reports', icon: ReportsIcon, subItems: [...] },
]
```
