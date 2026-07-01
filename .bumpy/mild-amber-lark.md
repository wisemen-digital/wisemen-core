---
"@wisemen/vue-core-design-system": major
---

**Breaking:** `DashboardSidebarNavLink` is now a discriminated union. Each nav link requires a `type` field.

### What changed

The type previously allowed `to` and `subItems` to both be optional on the same object. It is now split into two explicit shapes:

- **`SidebarNavLeafItem`** (`type: 'link'`) — a link that navigates directly to a route. Requires `to`, has no `subItems`.
- **`SidebarNavParentItem`** (`type: 'sub-items'`) — a link that expands into sub-items. Requires `subItems`, has no `to`.

Both are exported from `@wisemen/vue-core-design-system`. `DashboardSidebarNavLink` remains as the union type (`SidebarNavLeafItem | SidebarNavParentItem`).

### Migration

Add a `type` discriminator to every nav link object.

**Before:**
```ts
const links: DashboardSidebarNavLink[] = [
  { label: 'Dashboard', icon: DashboardIcon, to: { path: '/' } },
  { label: 'Reports', icon: ReportsIcon, subItems: [...] },
]
```

**After:**
```ts
const links: DashboardSidebarNavLink[] = [
  { type: 'link', label: 'Dashboard', icon: DashboardIcon, to: { path: '/' } },
  { type: 'sub-items', label: 'Reports', icon: ReportsIcon, subItems: [...] },
]
```
