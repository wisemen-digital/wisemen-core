---
name: page
description: >
  Full dashboard page system with header, breadcrumbs, action bars, content area, loading
  state, and a resizable detail pane. UIDashboardPage is the root orchestrator that composes
  8+ sub-components. Use for any page inside the dashboard layout shell.
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
  - DashboardPageProps
  - PageTab
  - PageBreadcrumb
  - DetailPaneConfig
  - DetailPaneVariant
  - DetailPaneStorage
  - DetailPaneStorageStrategy
  - useProvideDetailPaneContext
  - useInjectDetailPaneContext
---

# UIDashboardPage

Full dashboard page layout with a header (title, breadcrumbs, tabs, actions), optional action bar, scrollable content area, loading skeleton, and a resizable detail pane that slides in from the right.

## When to Use

- Building any page inside the dashboard application shell
- Pages that need a header with breadcrumbs, tabs, or action buttons
- Master-detail layouts with a togglable side panel
- Pages that need a consistent loading skeleton

**Use instead:** A plain `<div>` for non-dashboard pages (login, error, onboarding). `UIMainContent` alone for pages that do not need header/actions/detail-pane structure.

## Import

```ts
import {
  UIDashboardPage,
  UIDashboardPageContainer,
  UIDashboardPageContent,
  UIDashboardPageActions,
  UIDashboardPageHeaderMasterActionButton,
  UIDashboardPageLoadingState,
  UIDashboardPageDetailPaneToggle,
} from '@wisemen/vue-core-design-system'
```

Types:

```ts
import type {
  DashboardPageProps,
  PageTab,
  PageBreadcrumb,
  DetailPaneConfig,
  DetailPaneVariant,
  DetailPaneStorage,
  DetailPaneStorageStrategy,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDashboardPage,
  UIDashboardPageContent,
} from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIDashboardPage title="Users">
    <UIDashboardPageContent>
      <p>Your page content here.</p>
    </UIDashboardPageContent>
  </UIDashboardPage>
</template>
```

## API

### UIDashboardPage (root)

The main orchestrator component. Renders the header, wires up the detail pane context, and composes all sub-components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| null` | (required) | Page title shown in the header. Pass `null` to hide. |
| `breadcrumbs` | `PageBreadcrumb[]` | `[]` | Breadcrumb trail displayed in the header. |
| `tabs` | `PageTab[]` | `[]` | Tab items displayed below the header (currently passed through). |
| `actions` | `any[]` | `[]` | Action items (reserved for future use). |
| `detailPane` | `DetailPaneConfig \| null` | `null` | Configuration for the detail pane. Pass `null` to disable. |

#### v-model

| Model | Type | Default | Description |
|-------|------|---------|-------------|
| `isDetailPaneOpen` | `boolean` | `true` | Controls whether the detail pane is open. |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Main page content (typically `UIDashboardPageActions` + `UIDashboardPageContent`). |
| `title` | Override the default title rendering. |
| `title-left` | Content placed to the left of the title. |
| `header-action-left` | Actions in the left area of the header action row. |
| `header-action-center` | Actions in the center area of the header action row. |
| `header-action-right` | Actions in the right area of the header action row. |
| `header-master-actions` | Persistent actions to the right of the header (before the detail pane toggle). |
| `detail-pane` | Content rendered inside the detail pane. The pane only appears if both `detailPane` prop is set and this slot is provided. |

---

### UIDashboardPageContainer

A centered container with horizontal padding. Used internally by the header, actions, and content, but can also be used standalone.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string \| null` | `null` | Additional CSS classes merged with `mx-auto flex w-full flex-col px-2xl`. |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Container content. |

---

### UIDashboardPageContent

The main scrollable content area. Automatically adjusts its right margin when the detail pane is open (inline variants) using animated spring transitions.

#### Props

No props.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Page content rendered inside a `UIDashboardPageContainer` with `py-4xl` padding. |

---

### UIDashboardPageActions

An action bar rendered between the header and content. Adjusts its right padding to account for the detail pane.

#### Props

No props.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Full-width custom content for the action bar. |
| `left` | Left-aligned content in the default two-column layout. |
| `right` | Right-aligned content in the default two-column layout. |

---

### UIDashboardPageHeaderMasterActionButton

An icon button displayed in the master actions area of the header. Renders as a tertiary-variant `UIIconButton`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Component` | (required) | The icon component to display. |
| `label` | `string` | (required) | Accessible label for the button. |

#### Slots

No slots.

---

### UIDashboardPageLoadingState

A full-page loading skeleton that renders a `UIDashboardPage` with a `SkeletonItem` placeholder in the title area and a screen-reader-only loading heading.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `breadcrumbs` | `PageBreadcrumb[]` | (required) | Breadcrumbs to display while loading (preserves navigation context). |

#### Slots

No slots.

---

### UIDashboardPageDetailPaneToggle

A toggle button that opens/closes the detail pane. Displays a panel icon that visually indicates the current state. Includes a tooltip with a `Meta+I` keyboard shortcut hint.

#### Props

No props. Reads state from `DetailPaneContext` via `useInjectDetailPaneContext()`.

#### Slots

No slots.

### Emits

No custom events on any sub-component. State is managed through `v-model:isDetailPaneOpen` on the root `UIDashboardPage` and the `DetailPaneContext`.

## Types

### PageBreadcrumb

```ts
interface PageBreadcrumb {
  label: string
  to?: RouteLocationRaw   // optional navigation target
  icon?: Component         // optional leading icon
  imageSrc?: string        // optional image instead of icon
  isLoading?: boolean      // show skeleton placeholder
}
```

### PageTab

```ts
interface PageTab {
  label: string
  icon?: Component
  to: RouteLocationRaw
  keyboardShortcutKeys?: KeyboardKey[] | null
}
```

### DetailPaneConfig

```ts
interface DetailPaneConfig {
  variant?: DetailPaneVariant    // default: 'full-height-inline'
  isResizable?: boolean          // default: true
  storage?: DetailPaneStorage | null  // persistence configuration
}
```

### DetailPaneVariant

```ts
type DetailPaneVariant =
  | 'bordered-inline'       // Rounded bordered pane, pushes content left
  | 'bordered-overlay'      // Rounded bordered pane, overlays content
  | 'full-height-inline'    // Full-height pane with left border, pushes content
  | 'full-height-overlay'   // Full-height pane with left border, overlays content
```

**Inline** variants push the main content to the left when open. **Overlay** variants float on top of the content. On small screens (< 960px), all variants become overlay.

### DetailPaneStorage

```ts
interface DetailPaneStorage {
  key: string                          // storage key
  strategy: DetailPaneStorageStrategy  // 'localStorage' | 'routeQuery'
}

type DetailPaneStorageStrategy = 'localStorage' | 'routeQuery'
```

### DetailPaneContext

Provided via `useProvideDetailPaneContext` / `useInjectDetailPaneContext`:

```ts
interface DetailPaneContext {
  isOpen: Ref<boolean>
  isFloatingDetailPane: ComputedRef<boolean>
  isResizable: boolean
  isResizing: Ref<boolean>
  sidebarWidth: Ref<string>
  variant: DetailPaneVariant
  toggleIsOpen: () => void
  onResizeStart: (event: PointerEvent) => void
  onResizeKeyDown: (event: KeyboardEvent) => void
}
```

## Variants

### Detail Pane Variants

| Variant | Behavior | Pane Appearance |
|---------|----------|-----------------|
| `bordered-inline` | Pushes content left | Rounded corners, border, floating shadow, 2px inset |
| `bordered-overlay` | Overlays content | Rounded corners, border, floating shadow, 2px inset |
| `full-height-inline` | Pushes content left | Full height, left border only |
| `full-height-overlay` | Overlays content | Full height, left border only |

## Examples

### Page with Breadcrumbs and Actions

```vue
<script setup lang="ts">
import {
  UIDashboardPage,
  UIDashboardPageActions,
  UIDashboardPageContent,
  UIDashboardPageHeaderMasterActionButton,
} from '@wisemen/vue-core-design-system'
import { PlusIcon, SearchMdIcon } from '@wisemen/vue-core-icons'
import type { PageBreadcrumb } from '@wisemen/vue-core-design-system'

const breadcrumbs: PageBreadcrumb[] = [
  { label: 'Projects', to: { path: '/projects' } },
  { label: 'Project Alpha', to: { path: '/projects/alpha' } },
]
</script>

<template>
  <UIDashboardPage
    :breadcrumbs="breadcrumbs"
    title="Project Alpha"
  >
    <template #header-master-actions>
      <UIDashboardPageHeaderMasterActionButton
        :icon="SearchMdIcon"
        label="Search"
      />
    </template>

    <template #header-action-right>
      <UIButton :icon-left="PlusIcon" label="New Item" />
    </template>

    <UIDashboardPageActions>
      <template #left>
        <UIButton label="Filter" variant="secondary" />
      </template>
      <template #right>
        <UIButton label="Export" variant="secondary" />
      </template>
    </UIDashboardPageActions>

    <UIDashboardPageContent>
      <p>Main content here.</p>
    </UIDashboardPageContent>
  </UIDashboardPage>
</template>
```

### Page with Detail Pane

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UIDashboardPage,
  UIDashboardPageContent,
} from '@wisemen/vue-core-design-system'
import type { DetailPaneConfig } from '@wisemen/vue-core-design-system'

const isDetailOpen = ref<boolean>(true)

const detailPaneConfig: DetailPaneConfig = {
  variant: 'bordered-overlay',
  isResizable: true,
  storage: {
    key: 'users-detail-pane',
    strategy: 'localStorage',
  },
}
</script>

<template>
  <UIDashboardPage
    v-model:is-detail-pane-open="isDetailOpen"
    :detail-pane="detailPaneConfig"
    title="Users"
  >
    <UIDashboardPageContent>
      <p>Select a user to see details.</p>
    </UIDashboardPageContent>

    <template #detail-pane>
      <div class="flex h-full flex-col gap-lg p-lg">
        <h2 class="text-sm font-medium">User Details</h2>
        <p class="text-sm text-secondary">Detail content here.</p>
      </div>
    </template>
  </UIDashboardPage>
</template>
```

### Loading State

```vue
<script setup lang="ts">
import {
  UIDashboardPageLoadingState,
  UIDashboardPageContent,
  UIDashboardPage,
} from '@wisemen/vue-core-design-system'
import type { PageBreadcrumb } from '@wisemen/vue-core-design-system'

const isLoading = ref<boolean>(true)

const breadcrumbs: PageBreadcrumb[] = [
  { label: 'Projects', to: { path: '/projects' } },
]
</script>

<template>
  <UIDashboardPageLoadingState
    v-if="isLoading"
    :breadcrumbs="breadcrumbs"
  />
  <UIDashboardPage
    v-else
    :breadcrumbs="breadcrumbs"
    title="Projects"
  >
    <UIDashboardPageContent>
      <p>Loaded content.</p>
    </UIDashboardPageContent>
  </UIDashboardPage>
</template>
```

## Anatomy

```
UIDashboardPage  .relative.flex.size-full.h-full.flex-col.overflow-hidden.bg-secondary
  Page  <main id="main-content">
    DashboardPageHeader  <header .border-b.border-secondary>
      div .flex.h-11.items-center
        DashboardPageContainer
          RowLayout[justify=between]
            RowLayout[gap=none]
              DashboardPageHeaderSidebarToggle (toggle sidebar)
              Separator (if breadcrumbs/title)
              RowLayout[gap=xl]
                title / breadcrumbs / action-left slot
            action-center slot
            RowLayout[gap=xs]
              action-right slot
              DashboardPageHeaderActions
                Separator (if master-actions present)
                master-actions slot
                DashboardPageDetailPaneToggle (if detail pane)
      div (small-screen action row, shown < 1024px)
    div .relative.flex.size-full.overflow-hidden
      div .flex.size-full.flex-col.overflow-hidden
        <slot /> (DashboardPageActions + DashboardPageContent)
      DashboardPageDetailPane (if detail pane configured)
        AnimatePresence
          DashboardPageDetailPaneTransition
            Motion[translateX] (slide in/out)
              resize handle (if resizable)
              detail-pane slot content
```

## Styling

**Style file:** `detailPane.style.ts` -- uses `tv()` (Tailwind Variants) for detail pane styling.

**tv() slots:**

| Slot | Description |
|------|-------------|
| `pane` | The detail pane container. Positioning, border, shadow. |
| `resizeHandle` | The draggable resize handle on the left edge. |
| `resizeHandleBar` | The visual bar inside the resize handle. |

**Variants (in tv):**

| Variant | `pane` classes | `resizeHandle` classes |
|---------|----------------|------------------------|
| `bordered-inline` | `inset-y-2 right-2 rounded-lg border shadow-floating` | `-inset-y-2` |
| `bordered-overlay` | `inset-y-2 right-2 rounded-lg border shadow-floating` | `-inset-y-2` |
| `full-height-inline` | `inset-y-0 right-0 h-full border-l` | `inset-y-0` |
| `full-height-overlay` | `inset-y-0 right-0 h-full border-l` | `inset-y-0` |

**Detail pane dimensions:** Default width `20rem`, min `16rem`, max `25rem`. Resizable via pointer drag or Arrow Left/Right keyboard.

## Common Mistakes

### HIGH: Missing title causes accessibility warning

Wrong:
```vue
<UIDashboardPage :title="null">
  <!-- No h1 anywhere in the page -->
</UIDashboardPage>
```

Correct:
```vue
<UIDashboardPage :title="null">
  <template #title>
    <h1 class="text-sm font-medium">Custom Title</h1>
  </template>
  <UIDashboardPageContent>...</UIDashboardPageContent>
</UIDashboardPage>
```

The component warns in `onMounted` if no `<h1>` element is found on the page. When passing `title: null`, provide a custom title via the `#title` slot.

### HIGH: Providing detail-pane prop without the slot

Wrong:
```vue
<UIDashboardPage
  :detail-pane="{ variant: 'bordered-overlay' }"
  title="Users"
>
  <!-- no #detail-pane slot -->
</UIDashboardPage>
```

Correct:
```vue
<UIDashboardPage
  :detail-pane="{ variant: 'bordered-overlay' }"
  title="Users"
>
  <UIDashboardPageContent>...</UIDashboardPageContent>
  <template #detail-pane>
    <div>Detail content</div>
  </template>
</UIDashboardPage>
```

The detail pane only renders when both the `detailPane` prop is non-null AND the `#detail-pane` slot is provided.

### MEDIUM: Using DashboardPageContent without DashboardPage

Wrong:
```vue
<UIDashboardPageContent>
  <p>Content</p>
</UIDashboardPageContent>
```

Correct:
```vue
<UIDashboardPage title="Page">
  <UIDashboardPageContent>
    <p>Content</p>
  </UIDashboardPageContent>
</UIDashboardPage>
```

`UIDashboardPageContent` relies on `DetailPaneContext` for right-margin animation. Without `UIDashboardPage`, the context is missing (though it handles the null case gracefully with 0px padding).

## Accessibility

- Renders a `<main id="main-content">` landmark via the internal `Page` component.
- The header renders as a `<header>` element with proper `<h1>` for the page title.
- When breadcrumbs are present AND a title is set, a screen-reader-only `<h1>` is rendered to maintain heading hierarchy.
- The detail pane toggle uses `reka-ui Toggle` with `aria-label` that changes between "expand" and "collapse".
- The detail pane toggle tooltip shows the `Meta+I` keyboard shortcut.
- The sidebar toggle in the header uses `reka-ui Toggle` with an `aria-label` and a `Meta+B` keyboard shortcut.
- The detail pane resize handle has `role="separator"`, `aria-orientation="vertical"`, and `tabindex="0"` for keyboard accessibility. Arrow Left/Right keys resize the pane.
- On small screens (< 1024px), header actions wrap to a second row for better mobile UX.
- Reduced motion is respected throughout: all spring animations use duration 0 when `prefers-reduced-motion` is enabled.

## See Also

- [UIMainSidebar](../sidebar/) -- Navigation sidebar that pairs with the dashboard page
- [UILayout](../layout/) -- The outer shell (MainLayoutContainer + MainContent) that wraps the page
- [UIRowLayout](../row-layout/) -- Used extensively inside the page header
- [Layout System](../../foundations/layout-system/) -- Foundation overview of the full layout architecture
