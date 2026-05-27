---
name: tabs
description: >
  UITabs provides value-based tabbed navigation, while UITabsRouterLink provides
  route-based tabbed navigation integrated with Vue Router. Both support three
  visual variants, horizontal and vertical orientations, full-width mode, and
  adaptive overflow.
type: component
library: vue-core-design-system
category: navigation
exports:
  - UITabs
  - UITabsList
  - UITabsItem
  - UITabsContent
  - UITabsRouterLink
  - UITabsRouterLinkItem
---

# UITabs

Tabbed navigation with value-based and router-link modes, three visual variants, adaptive overflow, and vertical/horizontal orientations.

## When to Use

- Switching between content panels within a page section (value-based mode with `UITabs`)
- Route-based tab navigation where each tab maps to a named route (with `UITabsRouterLink`)
- When tabs may overflow the container and need adaptive collapsing into a dropdown

**Use instead:** For top-level app navigation, use `UISidebar`. For breadcrumb-style hierarchical navigation, use `UIBreadcrumbs`.

## Import

```ts
// Value-based tabs
import { UITabs, UITabsList, UITabsItem, UITabsContent } from '@wisemen/vue-core-design-system'

// Router-link tabs
import { UITabsRouterLink, UITabsRouterLinkItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITabs, UITabsList, UITabsItem, UITabsContent } from '@wisemen/vue-core-design-system'
import { User01Icon, Settings01Icon } from '@wisemen/vue-core-icons'

const activeTab = ref<string>('profile')
</script>

<template>
  <UITabs v-model="activeTab">
    <UITabsList>
      <UITabsItem :icon="User01Icon" label="Profile" value="profile" />
      <UITabsItem :icon="Settings01Icon" label="Settings" value="settings" />
    </UITabsList>
    <UITabsContent value="profile">
      <p>Profile content</p>
    </UITabsContent>
    <UITabsContent value="settings">
      <p>Settings content</p>
    </UITabsContent>
  </UITabs>
</template>
```

## Source Files

For full API details, read the props files. For usage examples, read the playground files.

- Props: `src/ui/tabs/tabs.props.ts`, `src/ui/tabs/tabsItem.props.ts`
- Components: `src/ui/tabs/Tabs.vue`, `src/ui/tabs/TabsList.vue`, `src/ui/tabs/TabsItem.vue`, `src/ui/tabs/TabsContent.vue`, `src/ui/tabs/TabsRouterLink.vue`, `src/ui/tabs/TabsRouterLinkItem.vue`
- Playground: `src/ui/tabs/stories/`

## See Also

- [sidebar](../sidebar/SKILL.md) -- For top-level app navigation
- [breadcrumbs](../breadcrumbs/SKILL.md) -- For hierarchical page location
- [adaptive-content](../adaptive-content/SKILL.md) -- Used internally for tab overflow
