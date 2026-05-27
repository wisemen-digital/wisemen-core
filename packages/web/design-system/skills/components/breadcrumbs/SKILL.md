---
name: breadcrumbs
description: >
  UIBreadcrumbs is a composite navigation component built from UIBreadcrumbRoot,
  UIBreadcrumbItems, UIBreadcrumbItem, and UIBreadcrumbSeparator parts. It renders
  a horizontal breadcrumb trail with optional icons, router links, and accessible
  label-hiding for icon-only items.
type: component
library: vue-core-design-system
category: navigation
exports:
  - UIBreadcrumbRoot
  - UIBreadcrumbItems
  - UIBreadcrumbItem
  - UIBreadcrumbSeparator
  - UIBreadcrumbSelect
  - UIBreadcrumbDateSelect
---

# UIBreadcrumbs

A multi-part breadcrumb navigation component for showing hierarchical page location.

## When to Use

- Display the user's current location within a page hierarchy
- Provide navigable links back to parent pages
- Show icon-only breadcrumb segments with accessible hidden labels

**Use instead:** For tab-based navigation within a page, use `UITabs`. For primary app navigation, use `UISidebar`.

## Import

```ts
import {
  UIBreadcrumbRoot,
  UIBreadcrumbItems,
  UIBreadcrumbItem,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIBreadcrumbRoot,
  UIBreadcrumbItems,
  UIBreadcrumbItem,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core-design-system'
import { Users01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIBreadcrumbRoot>
    <UIBreadcrumbItems>
      <UIBreadcrumbItem :icon="Users01Icon" label="Users" to="/" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Jeroen" to="/users/jeroen" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Projects" />
    </UIBreadcrumbItems>
  </UIBreadcrumbRoot>
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/breadcrumbs/breadcrumb.props.ts`
- Components: `src/ui/breadcrumbs/BreadcrumbRoot.vue`, `src/ui/breadcrumbs/BreadcrumbItems.vue`, `src/ui/breadcrumbs/BreadcrumbItem.vue`, `src/ui/breadcrumbs/BreadcrumbSeparator.vue`
- Playground: `src/ui/breadcrumbs/stories/`

## See Also

- [tabs](../tabs/SKILL.md) -- For tab-based navigation within a page
- [page](../page/SKILL.md) -- Dashboard page layout that typically includes breadcrumbs
