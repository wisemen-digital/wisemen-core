---
name: sidebar
description: >
  Main navigation sidebar with collapsible behavior, navigation groups, links with badges
  and status dots, global search trigger, header logo, footer account card, and featured card.
  On small screens, the sidebar becomes a dialog overlay.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIMainSidebar
  - UIMainSidebarHeaderLogoWithText
  - UIMainSidebarGlobalSearch
  - UIMainSidebarNavigationGroup
  - UIMainSidebarNavigationLink
  - UIMainSidebarNavigationLinkBadge
  - UIMainSidebarNavigationLinkStatusDot
  - UIMainSidebarFooterAccountCard
  - UIMainSidebarFooterFeaturedCard
  - useMainSidebar
---

# UIMainSidebar

Primary navigation sidebar with three zones (header, navigation, footer), collapsible behavior (hidden or minified), and responsive dialog mode on small screens.

## When to Use

- As the primary navigation for any dashboard application
- When you need collapsible sidebar navigation with grouped links
- Building an app shell with logo, search, nav links, and user account

**Use instead:** A custom sidebar only if you need fundamentally different layout. For secondary navigation, use tabs or dropdown menus.

## Import

```ts
import {
  UIMainSidebar, UIMainSidebarHeaderLogoWithText, UIMainSidebarGlobalSearch,
  UIMainSidebarNavigationGroup, UIMainSidebarNavigationLink,
  UIMainSidebarNavigationLinkBadge, UIMainSidebarNavigationLinkStatusDot,
  UIMainSidebarFooterAccountCard, UIMainSidebarFooterFeaturedCard, useMainSidebar,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIMainSidebar, UIMainSidebarHeaderLogoWithText,
  UIMainSidebarNavigationGroup, UIMainSidebarNavigationLink,
  UIMainSidebarFooterAccountCard,
} from '@wisemen/vue-core-design-system'
import { DashboardIcon, UsersIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMainSidebar collapsed-variant="minified">
    <template #header>
      <UIMainSidebarHeaderLogoWithText src="/logo.png" alt="Logo" name="My App" />
    </template>
    <template #navigation>
      <UIMainSidebarNavigationGroup>
        <UIMainSidebarNavigationLink :icon="DashboardIcon" label="Dashboard" :to="{ name: 'dashboard' }" />
        <UIMainSidebarNavigationLink :icon="UsersIcon" label="Users" :to="{ name: 'users' }" />
      </UIMainSidebarNavigationGroup>
    </template>
    <template #footer>
      <UIMainSidebarFooterAccountCard name="John Doe" email="john@example.com" />
    </template>
  </UIMainSidebar>
</template>
```

## Source Files

For full API details, read the props files.

- Props: `src/ui/sidebar/mainSidebar.props.ts`
- Components: `src/ui/sidebar/MainSidebar.vue`, `src/ui/sidebar/MainSidebarHeaderLogoWithText.vue`, `src/ui/sidebar/MainSidebarNavigationGroup.vue`, `src/ui/sidebar/MainSidebarNavigationLink.vue`, `src/ui/sidebar/MainSidebarFooterAccountCard.vue`
- Composable: `src/ui/sidebar/mainSidebar.composable.ts`

## See Also

- [layout](../layout/SKILL.md) -- Top-level app shell that wraps the sidebar
- [page](../page/SKILL.md) -- Dashboard page layout used inside the content area
- [logo](../logo/SKILL.md) -- Logo component used in sidebar header
