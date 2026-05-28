---
name: layout
description: >
  Top-level application shell components that provide the outermost page structure.
  UIMainLayout is the full-screen flex wrapper, and UIMainContent is the
  sidebar-aware content area with animated padding.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIMainLayout
  - UIMainContent
---

# UIMainLayout / UIMainContent

Top-level application shell that wraps the sidebar and main content area into a full-viewport layout.

## When to Use

- As the outermost wrapper for every dashboard application page
- When combining `UIMainSidebar` with page content that needs sidebar-aware padding
- Building the root layout of an app that uses the design system navigation

**Use instead:** A plain `div` only for pages that do not use the sidebar or dashboard page system (e.g., login, error pages).

## Import

```ts
import { UIMainLayout, UIMainContent } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIMainLayout,
  UIMainContent,
  UIMainSidebar,
} from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMainLayout>
    <UIMainSidebar>
      <!-- sidebar slots -->
    </UIMainSidebar>
    <UIMainContent>
      <RouterView />
    </UIMainContent>
  </UIMainLayout>
</template>
```

## Source Files

For full API details, read the component files.

- Components: `src/ui/layout/MainLayout.vue`, `src/ui/layout/MainContent.vue`

## See Also

- [sidebar](../sidebar/SKILL.md) -- Main navigation sidebar used inside the layout
- [page](../page/SKILL.md) -- Dashboard page layout used inside MainContent
