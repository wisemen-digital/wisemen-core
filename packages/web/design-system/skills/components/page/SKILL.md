---
name: page
description: >
  Full dashboard page system with header, breadcrumbs, action bars, content area, loading
  state, and a resizable detail pane. UIDashboardPage is the root orchestrator that composes
  8+ sub-components.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIDashboardPage
  - UIDashboardPageContainer
  - UIDashboardPageContent
  - UIDashboardPageHeader
  - UIDashboardPageActions
  - UIDashboardPageHeaderMasterActionButton
  - UIDashboardPageLoadingState
  - UIDashboardPageDetailPaneToggle
  - useProvideDetailPaneContext
  - useInjectDetailPaneContext
---

# UIDashboardPage

Full dashboard page layout with a header (title, breadcrumbs, tabs, actions), optional action bar, scrollable content area, loading skeleton, and a resizable detail pane.

## When to Use

- Building any page inside the dashboard application shell
- Pages that need a header with breadcrumbs, tabs, or action buttons
- Master-detail layouts with a togglable side panel
- Pages that need a consistent loading skeleton

**Use instead:** A plain `<div>` for non-dashboard pages (login, error, onboarding). `UIMainContent` alone for pages that do not need header/actions/detail-pane structure.

## Import

```ts
import {
  UIDashboardPage, UIDashboardPageContainer, UIDashboardPageContent,
  UIDashboardPageActions, UIDashboardPageHeaderMasterActionButton,
  UIDashboardPageLoadingState, UIDashboardPageDetailPaneToggle,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDashboardPage, UIDashboardPageContainer, UIDashboardPageContent,
} from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIDashboardPage title="Users" :breadcrumbs="[{ label: 'Users' }]">
    <UIDashboardPageContainer>
      <UIDashboardPageContent>
        <!-- page content here -->
      </UIDashboardPageContent>
    </UIDashboardPageContainer>
  </UIDashboardPage>
</template>
```

## Source Files

For full API details, read the props and composable files.

- Props: `src/ui/page/dashboardPage.props.ts`
- Components: `src/ui/page/DashboardPage.vue`, `src/ui/page/DashboardPageContainer.vue`, `src/ui/page/DashboardPageContent.vue`, `src/ui/page/DashboardPageActions.vue`, `src/ui/page/DashboardPageLoadingState.vue`
- Composables: `src/ui/page/detailPane.context.ts`

## See Also

- [layout](../layout/SKILL.md) -- Top-level application shell that wraps the page
- [sidebar](../sidebar/SKILL.md) -- Main navigation sidebar
- [breadcrumbs](../breadcrumbs/SKILL.md) -- Breadcrumb navigation used in page headers
