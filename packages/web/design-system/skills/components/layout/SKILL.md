---
name: layout
description: >
  Top-level application shell components that provide the outermost page structure.
  UIMainLayoutContainer is the full-screen flex wrapper, and UIMainContent is the
  sidebar-aware content area with animated padding. Use these as the root of every
  page in a dashboard application.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: layout
requires:
  - layout-system
exports:
  - UIMainLayoutContainer
  - UIMainContent
---

# UILayout (MainLayoutContainer + MainContent)

Top-level application shell that wraps the sidebar and main content area into a full-viewport layout.

## When to Use

- As the outermost wrapper for every dashboard application page
- When combining `UIMainSidebar` with page content that needs sidebar-aware padding
- Building the root layout of an app that uses the design system navigation

**Use instead:** A plain `div` only for pages that do not use the sidebar or dashboard page system (e.g., login, error pages).

## Import

```ts
import { UIMainLayoutContainer, UIMainContent } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIMainLayoutContainer,
  UIMainContent,
  UIMainSidebar,
} from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMainLayoutContainer>
    <UIMainSidebar>
      <!-- sidebar slots -->
    </UIMainSidebar>
    <UIMainContent>
      <!-- page content (router-view, DashboardPage, etc.) -->
    </UIMainContent>
  </UIMainLayoutContainer>
</template>
```

## API

### UIMainLayoutContainer

The outermost shell. Renders a full-viewport `div` with `h-dvh` and `overflow-hidden`.

#### Props

No props.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Must contain `UIMainSidebar` and `UIMainContent` as direct children. |

---

### UIMainContent

The main content area that sits beside the sidebar. Automatically applies animated left-padding that tracks the sidebar width, so content shifts smoothly when the sidebar opens, closes, or changes between collapsed variants.

#### Props

No props.

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Page content (typically a `<router-view>` or `UIDashboardPage`). Rendered inside a bordered, rounded container. |

### Emits

No custom events on either component.

## Variants

These components have no visual variants. `UIMainContent` automatically adapts its padding based on sidebar state (open/closed, floating/minified) via the `useMainSidebar` composable.

## Examples

### Full Application Shell

```vue
<script setup lang="ts">
import {
  UIMainLayoutContainer,
  UIMainContent,
  UIMainSidebar,
  UIMainSidebarHeaderLogoWithText,
  UIMainSidebarNavigationGroup,
  UIMainSidebarNavigationLink,
  UIMainSidebarFooterAccountCard,
} from '@wisemen/vue-core-design-system'
import { DashboardIcon, UsersIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMainLayoutContainer>
    <UIMainSidebar collapsed-variant="minified">
      <template #header>
        <UIMainSidebarHeaderLogoWithText
          url="/logo.png"
          name="My App"
        />
      </template>
      <template #navigation>
        <UIMainSidebarNavigationGroup label="Main">
          <UIMainSidebarNavigationLink
            :to="{ name: 'dashboard' }"
            :icon="DashboardIcon"
            label="Dashboard"
          />
        </UIMainSidebarNavigationGroup>
      </template>
      <template #footer>
        <UIMainSidebarFooterAccountCard
          name="Jane Doe"
          email="jane@example.com"
          :menu-options="[]"
          :on-sign-out="() => {}"
        />
      </template>
    </UIMainSidebar>

    <UIMainContent>
      <router-view />
    </UIMainContent>
  </UIMainLayoutContainer>
</template>
```

### Without Sidebar

```vue
<script setup lang="ts">
import { UIMainLayoutContainer, UIMainContent } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMainLayoutContainer>
    <UIMainContent>
      <div class="p-8">
        <h1>Standalone page content</h1>
      </div>
    </UIMainContent>
  </UIMainLayoutContainer>
</template>
```

## Anatomy

```
UIMainLayoutContainer  div.flex.size-full.h-dvh.overflow-hidden
  UIMainSidebar (absolute positioned)
  UIMainContent  Motion[paddingLeft=sidebarWidth] .size-full.overflow-hidden.bg-primary.p-md
    div .size-full.overflow-hidden.rounded-xl.border.border-secondary.shadow-sm/5
      <slot />
```

## Styling

**Style file:** No separate style file. Both components use inline Tailwind classes.

**UIMainLayoutContainer:** `flex size-full h-dvh overflow-hidden` -- fills the viewport.

**UIMainContent:** Uses `motion-v` `Motion` component for animated `paddingLeft` that tracks `sidebarWidth` from `useMainSidebar()`. The inner container has `rounded-xl border border-secondary shadow-sm/5` for the bordered content area. The spring animation has a duration of 0.3s with no bounce, respecting `prefers-reduced-motion`.

## Common Mistakes

### HIGH: Placing UIMainContent without UIMainLayoutContainer

Wrong:
```vue
<UIMainContent>
  <router-view />
</UIMainContent>
```

Correct:
```vue
<UIMainLayoutContainer>
  <UIMainSidebar>...</UIMainSidebar>
  <UIMainContent>
    <router-view />
  </UIMainContent>
</UIMainLayoutContainer>
```

`UIMainLayoutContainer` provides the full-viewport flex context. Without it, `UIMainContent` will not be sized correctly.

### MEDIUM: Placing sidebar after content in DOM order

Wrong:
```vue
<UIMainLayoutContainer>
  <UIMainContent>...</UIMainContent>
  <UIMainSidebar>...</UIMainSidebar>
</UIMainLayoutContainer>
```

Correct:
```vue
<UIMainLayoutContainer>
  <UIMainSidebar>...</UIMainSidebar>
  <UIMainContent>...</UIMainContent>
</UIMainLayoutContainer>
```

The sidebar is absolutely positioned and must come first. `UIMainContent` calculates its padding based on sidebar state.

## Accessibility

- `UIMainLayoutContainer` renders a plain `div`. It does not add landmark roles.
- `UIMainContent` is purely presentational, handling layout animation.
- Reduced motion is respected: animation duration is set to 0 when `prefers-reduced-motion` is enabled.
- Focus management and landmarks are handled by child components (`UIMainSidebar` provides dialog semantics on mobile, `UIDashboardPage` renders a `<main>` landmark).

## See Also

- [UIMainSidebar](../sidebar/) -- The navigation sidebar that pairs with UIMainContent
- [UIDashboardPage](../page/) -- The page component rendered inside UIMainContent
- [Layout System](../../foundations/layout-system/) -- Foundation overview of the full layout architecture
