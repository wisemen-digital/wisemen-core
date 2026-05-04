---
name: layout-system
description: >
  Layout primitives and page composition for @wisemen/vue-core-design-system.
  Covers UIRowLayout and UIColumnLayout (flex containers with gap/align/justify),
  the DashboardPage system (header, actions, detail pane, loading state),
  and UIMainSidebar (navigation groups, links, global search). Load before
  building page layouts or navigation.
type: foundation
category: layout-architecture
library: vue-core-design-system
library_version: "0.8.0"
sources:
  - "packages/web/design-system/src/ui/row-layout/RowLayout.vue"
  - "packages/web/design-system/src/ui/column-layout/ColumnLayout.vue"
  - "packages/web/design-system/src/ui/page/DashboardPage.vue"
  - "packages/web/design-system/src/ui/sidebar/MainSidebar.vue"
---

# Layout System

Flex primitives, page composition, and navigation sidebar.

## Overview

The layout system has three tiers:

1. **Primitives** — `UIRowLayout` (horizontal) and `UIColumnLayout` (vertical) for basic flex composition
2. **Page System** — `UIDashboardPage` and its sub-components for full page layouts with headers, actions, and detail panes
3. **Navigation** — `UIMainSidebar` for the primary navigation sidebar with groups, links, and global search

## Flex Primitives

### UIRowLayout

Horizontal flex container:

```vue
<UIRowLayout gap="lg" align="center" justify="between">
  <UIButton label="Cancel" variant="secondary" />
  <UIButton label="Save" variant="primary" />
</UIRowLayout>
```

### UIColumnLayout

Vertical flex container:

```vue
<UIColumnLayout gap="xl">
  <UITextField v-model="name" label="Name" />
  <UITextField v-model="email" label="Email" type="email" />
</UIColumnLayout>
```

**Shared props:**

| Prop | Type | Description |
|------|------|-------------|
| `gap` | Spacing token (`none` through `11xl`) | Gap between children |
| `align` | UIRowLayout: `start \| center \| end \| baseline`, UIColumnLayout: `start \| center \| end` | Cross-axis alignment |
| `justify` | `start \| center \| end \| between` | Main-axis distribution |
| `as` | `string` (default `'div'`) | HTML element to render |

## DashboardPage System

A full page layout with 8+ sub-components. `UIDashboardPage` is the root orchestrator -- it receives `title`, `breadcrumbs`, `tabs`, `actions`, and `detailPane` as props and composes the header, content, and detail pane internally.

```
UIDashboardPage (root, receives title/breadcrumbs/tabs/detailPane props)
  ├── DashboardPageHeader (internal, uses UIDashboardPageContainer)
  │   ├── title / breadcrumbs / tab slots
  │   ├── header-action-left/center/right slots
  │   └── header-master-actions slot
  │       └── UIDashboardPageDetailPaneToggle (if detail pane)
  ├── UIDashboardPageActions (optional, between header and content)
  ├── UIDashboardPageContent (scrollable main content)
  ├── UIDashboardPageLoadingState (full-page skeleton)
  └── DashboardPageDetailPane (if detailPane prop + #detail-pane slot)
```

### Basic Page Layout

```vue
<template>
  <UIDashboardPage title="Users">
    <UIDashboardPageActions>
      <template #right>
        <UIButton label="Add User" @click="openCreateDialog" />
      </template>
    </UIDashboardPageActions>

    <UIDashboardPageContent>
      <!-- Table, list, or other content -->
    </UIDashboardPageContent>
  </UIDashboardPage>
</template>
```

### With Detail Pane

```vue
<template>
  <UIDashboardPage
    v-model:is-detail-pane-open="isDetailOpen"
    :detail-pane="{ variant: 'bordered-overlay' }"
    title="Users"
  >
    <UIDashboardPageContent>
      <!-- Master list -->
    </UIDashboardPageContent>

    <template #detail-pane>
      <UserDetailPane :user="selectedUser" />
    </template>
  </UIDashboardPage>
</template>
```

### Loading State

```vue
<UIDashboardPageLoadingState
  v-if="isLoading"
  :breadcrumbs="breadcrumbs"
/>
<UIDashboardPage
  v-else
  :breadcrumbs="breadcrumbs"
  title="Projects"
>
  <UIDashboardPageContent>...</UIDashboardPageContent>
</UIDashboardPage>
```

## MainSidebar System

Navigation sidebar with groups, links, badges, and search.

### Components

| Component | Purpose |
|-----------|---------|
| `UIMainSidebar` | Root sidebar container |
| `UIMainSidebarHeaderLogoWithText` | Logo in header |
| `UIMainSidebarGlobalSearch` | Search trigger |
| `UIMainSidebarNavigationGroup` | Section of links |
| `UIMainSidebarNavigationLink` | Single nav link |
| `UIMainSidebarNavigationLinkBadge` | Badge on a link |
| `UIMainSidebarNavigationLinkStatusDot` | Status dot on a link |
| `UIMainSidebarFooterAccountCard` | User account card |
| `UIMainSidebarFooterFeaturedCard` | Promotional/featured card |

### useMainSidebar Composable

```ts
import { useMainSidebar } from '@wisemen/vue-core-design-system'

const { isSidebarOpen, isFloatingSidebar, closeIfFloatingSidebar } = useMainSidebar()
```

### Basic Sidebar

```vue
<template>
  <UIMainSidebar collapsed-variant="minified">
    <template #header>
      <UIMainSidebarHeaderLogoWithText url="/logo.png" name="My App" />
    </template>

    <template #navigation>
      <UIMainSidebarNavigationGroup label="Main">
        <UIMainSidebarNavigationLink
          :to="{ name: 'dashboard' }"
          :icon="DashboardIcon"
          label="Dashboard"
        />
        <UIMainSidebarNavigationLink
          :to="{ name: 'users' }"
          :icon="UsersIcon"
          label="Users"
        >
          <template #right>
            <UIMainSidebarNavigationLinkBadge label="5" />
          </template>
        </UIMainSidebarNavigationLink>
      </UIMainSidebarNavigationGroup>
    </template>

    <template #footer>
      <UIMainSidebarFooterAccountCard
        name="Jane Doe"
        email="jane@example.com"
        :menu-options="[]"
        :on-sign-out="handleLogout"
      />
    </template>
  </UIMainSidebar>
</template>
```

### Sidebar Types

```ts
interface DashboardSidebarNavLink {
  icon: Component
  label: string
  to: RouteLocationRaw
  isActive?: (route: RouteLocationNormalized) => boolean
  keyboardShortcut?: string | null
  onClick?: () => void
}

interface DashboardSidebarGroup {
  label?: string
  links: DashboardSidebarNavLink[]
}
```

## Common Mistakes

### HIGH: Using DashboardPage without the layout shell

Wrong:
```vue
<UIDashboardPage title="Users">
  <UIDashboardPageContent>...</UIDashboardPageContent>
</UIDashboardPage>
```

Correct:
```vue
<UIMainLayoutContainer>
  <UIMainSidebar>...</UIMainSidebar>
  <UIMainContent>
    <UIDashboardPage title="Users">
      <UIDashboardPageContent>...</UIDashboardPageContent>
    </UIDashboardPage>
  </UIMainContent>
</UIMainLayoutContainer>
```

`UIDashboardPage` should be rendered inside `UIMainContent`, which is part of the `UIMainLayoutContainer` shell that manages sidebar positioning and content padding.

### MEDIUM: Using raw flexbox instead of Row/ColumnLayout

Wrong:
```html
<div class="flex flex-row items-center gap-4">
```

Correct:
```vue
<UIRowLayout gap="xl" align="center">
```

The layout components ensure consistent spacing using the design token scale.

## See Also

- [row-layout](../../components/row-layout/SKILL.md) — UIRowLayout component details
- [column-layout](../../components/column-layout/SKILL.md) — UIColumnLayout component details
- [page](../../components/page/SKILL.md) — DashboardPage full API
- [sidebar](../../components/sidebar/SKILL.md) — MainSidebar full API
