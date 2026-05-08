---
name: sidebar
description: >
  Main navigation sidebar with collapsible behavior, navigation groups, links with badges
  and status dots, global search trigger, header logo, footer account card, and featured card.
  Includes the useMainSidebar composable for programmatic control. On small screens, the
  sidebar becomes a dialog overlay. Use for primary app navigation in dashboard layouts.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIMainSidebar
  - UIMainSidebarProps
  - UIMainSidebarHeaderLogoWithText
  - UIMainSidebarGlobalSearch
  - UIMainSidebarNavigationGroup
  - UIMainSidebarNavigationLink
  - UIMainSidebarNavigationLinkBadge
  - UIMainSidebarNavigationLinkStatusDot
  - UIMainSidebarFooterAccountCard
  - UIMainSidebarFooterFeaturedCard
  - useMainSidebar
  - UIMainSidebarCollapsedVariant
  - UIMainSidebarGroup
  - UIMainSidebarNavLink
---

# UIMainSidebar

Primary navigation sidebar with three zones (header, navigation, footer), collapsible behavior (hidden or minified), and responsive dialog mode on small screens. Includes sub-components for logo, search, navigation groups/links, badges, status dots, and user account cards.

## When to Use

- As the primary navigation for any dashboard application
- When you need collapsible sidebar navigation with grouped links
- Building an app shell with logo, search, nav links, and user account

**Use instead:** A custom sidebar only if you need fundamentally different layout (e.g., horizontal nav). For secondary/contextual navigation, use tabs or dropdown menus.

## Import

```ts
import {
  UIMainSidebar,
  UIMainSidebarHeaderLogoWithText,
  UIMainSidebarGlobalSearch,
  UIMainSidebarNavigationGroup,
  UIMainSidebarNavigationLink,
  UIMainSidebarNavigationLinkBadge,
  UIMainSidebarNavigationLinkStatusDot,
  UIMainSidebarFooterAccountCard,
  UIMainSidebarFooterFeaturedCard,
  useMainSidebar,
} from '@wisemen/vue-core-design-system'
```

Types:

```ts
import type {
  UIMainSidebarProps,
  UIMainSidebarCollapsedVariant,
  UIMainSidebarGroup,
  UIMainSidebarNavLink,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIMainSidebar,
  UIMainSidebarHeaderLogoWithText,
  UIMainSidebarNavigationGroup,
  UIMainSidebarNavigationLink,
  UIMainSidebarFooterAccountCard,
} from '@wisemen/vue-core-design-system'
import { BarChartSquare02Icon, Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMainSidebar collapsed-variant="minified">
    <template #header>
      <UIMainSidebarHeaderLogoWithText url="/logo.png" name="My App" />
    </template>
    <template #navigation>
      <UIMainSidebarNavigationGroup label="Main">
        <UIMainSidebarNavigationLink
          :to="{ name: 'dashboard' }"
          :icon="BarChartSquare02Icon"
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
</template>
```

## API

### UIMainSidebar (root)

The root sidebar container. On large screens (>= 960px), renders as a static panel with open/close animation. On small screens (< 960px), renders as a `DialogRoot` overlay with a backdrop.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collapsedVariant` | `'hidden' \| 'minified'` | `'hidden'` | Behavior when collapsed. `'hidden'` slides out entirely. `'minified'` collapses to a 48px icon-only strip. |

#### Slots

| Slot | Description |
|------|-------------|
| `header` | Top section of the sidebar (logo, search). |
| `navigation` | Middle scrollable section (navigation groups and links). |
| `footer` | Bottom section (featured card, footer nav, account card). |

---

### UIMainSidebarHeaderLogoWithText

Displays a logo image with an app name and an optional right slot (typically a search button). The name and right slot fade out when the sidebar is minified and closed.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | (required) | Application name displayed next to the logo. |
| `url` | `string` | (required) | URL of the logo image. |

#### Slots

| Slot | Description |
|------|-------------|
| `right` | Content placed to the right of the logo and name (e.g., global search button). |

---

### UIMainSidebarGlobalSearch

An icon button that emits a `click` event to trigger global search. Displays a search icon with an accessible label.

#### Props

No props.

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | none | Emitted when the search button is clicked. Wire this to open your search dialog/palette. |

---

### UIMainSidebarNavigationGroup

A labeled group of navigation links. The label fades out when the sidebar is minified and closed.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `null` | Optional group label displayed above the links. Pass `null` or omit for an unlabeled group. |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | `UIMainSidebarNavigationLink` components. |

---

### UIMainSidebarNavigationLink

A single navigation link with an icon, label, optional keyboard shortcut tooltip, and an optional right slot for badges/dots. Uses `vue-router` `RouterLink` for navigation. Automatically highlights when the current route matches.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Component` | (required) | Icon component displayed on the left side. |
| `label` | `string` | (required) | Text label for the link. |
| `to` | `RouteLocationRaw` | (required) | Vue Router destination. |
| `isActive` | `(route: RouteLocationNormalized) => boolean` | `() => false` | Custom function to determine active state beyond the default route matching. |
| `keyboardShortcut` | `string \| null` | `null` | Keyboard shortcut string displayed in the tooltip (e.g., `'meta_d'`). |

#### Slots

| Slot | Description |
|------|-------------|
| `right` | Content placed to the right of the label (badges, status dots, icons). Only visible when the sidebar is expanded. |

#### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | none | Emitted when the link is clicked (in addition to navigation). |

---

### UIMainSidebarNavigationLinkBadge

A small badge rendered inside a navigation link's `right` slot. Automatically changes color based on the link's active state (`brand` when active, `gray` when inactive).

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | (required) | Badge text (typically a count like `"10"`). |

#### Slots

No slots.

---

### UIMainSidebarNavigationLinkStatusDot

A small green status dot rendered inside a navigation link's `right` slot. Has no props or configuration -- always renders as a 2px green circle.

#### Props

No props.

#### Slots

No slots.

---

### UIMainSidebarFooterAccountCard

A user account card with avatar, name, email, and a dropdown menu for account actions and sign-out. The card collapses to an avatar-only view when minified.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | (required) | User's display name. |
| `email` | `string` | (required) | User's email address. |
| `avatarUrl` | `string` | `undefined` | URL for the user's avatar image. Falls back to initials if omitted. |
| `menuOptions` | `MenuOption[]` | (required) | Array of dropdown menu items. |
| `onSignOut` | `() => void` | (required) | Callback invoked when the "Sign out" menu item is selected. |

**MenuOption type:**

```ts
interface MenuOption {
  icon: Component        // Icon component for the menu item
  label: string          // Menu item text
  onSelect: () => void   // Callback when selected
  keyboardShortcut?: string  // Optional keyboard shortcut hint
}
```

#### Slots

No slots.

#### Emits

No custom events. Uses `onSignOut` prop callback.

---

### UIMainSidebarFooterFeaturedCard

A placeholder component for promotional or featured content in the sidebar footer. Currently renders an empty `<div>`. Override with custom content as needed.

#### Props

No props.

#### Slots

No slots.

---

### useMainSidebar Composable

A shared composable that manages sidebar state globally. Uses `@vueuse/core` for breakpoints and localStorage persistence.

```ts
import { useMainSidebar } from '@wisemen/vue-core-design-system'

const {
  isSidebarOpen,         // Ref<boolean> - get/set sidebar open state
  isFloatingSidebar,     // ComputedRef<boolean> - true when screen < 960px
  collapsedVariant,      // Ref<MainSidebarCollapsedVariant>
  sidebarWidth,          // Ref<string> - current width (e.g., '14rem', '3rem')
  closeIfFloatingSidebar, // () => void - close only if in floating mode
  setCollapsedVariant,   // (variant) => void - change collapsed behavior
  minifiedSidebarWidth,  // string - '3rem' (48px)
  sidebarContainerPadding, // string - '0.5625rem' (9px)
  sidebarIconSize,       // string - '1rem' (16px)
  sidebarIconCellSize,   // string - '1.875rem' (30px)
  sidebarLinkHeight,     // string - '1.875rem' (30px)
  sidebarLogoPadding,    // string - '0.1875rem' (3px)
  sidebarAvatarPadding,  // string - '0.1875rem' (3px)
  sidebarLogoHeight,     // string - '2.6rem' (41.6px)
} = useMainSidebar()
```

**Key behaviors:**
- Open/close state is persisted to `localStorage` under key `dashboard-sidebar-is-open`.
- On screens < 960px, the sidebar becomes floating (dialog overlay). The floating open state is separate from the persisted setting.
- When `collapsedVariant` is `'minified'`, closing the sidebar shrinks it to `3rem` (48px) instead of hiding it completely.
- Default sidebar width is `14rem` (224px).

## Types

### DashboardSidebarNavLink

```ts
interface DashboardSidebarNavLink {
  icon: Component
  label: string
  to: RouteLocationRaw
  isActive?: (route: RouteLocationNormalized) => boolean
  keyboardShortcut?: string | null
  onClick?: () => void
}
```

### DashboardSidebarGroup

```ts
interface DashboardSidebarGroup {
  label?: string
  links: DashboardSidebarNavLink[]
}
```

### MainSidebarCollapsedVariant

```ts
type MainSidebarCollapsedVariant = 'hidden' | 'minified'
```

## Variants

### Collapsed Variants

| Variant | Collapsed State | Open State |
|---------|-----------------|------------|
| `hidden` | Sidebar slides completely out of view (width 0) | Full sidebar at 14rem |
| `minified` | Collapses to 3rem icon-only strip | Full sidebar at 14rem |

### Responsive Behavior

| Screen Size | Behavior |
|-------------|----------|
| >= 960px | Static panel, controlled by `collapsedVariant` |
| < 960px | Dialog overlay with backdrop, slides in from left |

## Examples

### Full Sidebar with All Features

```vue
<script setup lang="ts">
import {
  UIMainSidebar,
  UIMainSidebarHeaderLogoWithText,
  UIMainSidebarGlobalSearch,
  UIMainSidebarNavigationGroup,
  UIMainSidebarNavigationLink,
  UIMainSidebarNavigationLinkBadge,
  UIMainSidebarNavigationLinkStatusDot,
  UIMainSidebarFooterAccountCard,
  UIMainSidebarFooterFeaturedCard,
} from '@wisemen/vue-core-design-system'
import {
  BarChartSquare02Icon,
  Rows01Icon,
  File05Icon,
  Settings01Icon,
  LifeBuoy01Icon,
} from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMainSidebar collapsed-variant="minified">
    <template #header>
      <UIMainSidebarHeaderLogoWithText url="/logo.png" name="Wisemen">
        <template #right>
          <UIMainSidebarGlobalSearch @click="openCommandPalette" />
        </template>
      </UIMainSidebarHeaderLogoWithText>
    </template>

    <template #navigation>
      <UIMainSidebarNavigationGroup label="Main">
        <UIMainSidebarNavigationLink
          :to="{ name: 'dashboard' }"
          :icon="BarChartSquare02Icon"
          label="Dashboard"
        />
        <UIMainSidebarNavigationLink
          :to="{ name: 'projects' }"
          :icon="Rows01Icon"
          label="Projects"
        >
          <template #right>
            <UIMainSidebarNavigationLinkBadge label="12" />
            <UIMainSidebarNavigationLinkStatusDot />
          </template>
        </UIMainSidebarNavigationLink>
      </UIMainSidebarNavigationGroup>

      <UIMainSidebarNavigationGroup label="Resources">
        <UIMainSidebarNavigationLink
          :to="{ name: 'documents' }"
          :icon="File05Icon"
          label="Documents"
          keyboard-shortcut="meta_d"
        />
      </UIMainSidebarNavigationGroup>
    </template>

    <template #footer>
      <UIMainSidebarFooterFeaturedCard />
      <UIMainSidebarNavigationGroup>
        <UIMainSidebarNavigationLink
          :to="{ name: 'support' }"
          :icon="LifeBuoy01Icon"
          label="Support"
        />
        <UIMainSidebarNavigationLink
          :to="{ name: 'settings' }"
          :icon="Settings01Icon"
          label="Settings"
        />
      </UIMainSidebarNavigationGroup>
      <UIMainSidebarFooterAccountCard
        name="Jane Doe"
        email="jane.doe@example.com"
        avatar-url="/avatars/jane.jpg"
        :menu-options="[
          {
            icon: Settings01Icon,
            label: 'Account settings',
            onSelect: () => router.push({ name: 'account' }),
          },
          {
            icon: LifeBuoy01Icon,
            label: 'Support',
            onSelect: () => router.push({ name: 'support' }),
          },
        ]"
        :on-sign-out="handleSignOut"
      />
    </template>
  </UIMainSidebar>
</template>
```

### Programmatic Sidebar Control

```vue
<script setup lang="ts">
import { useMainSidebar } from '@wisemen/vue-core-design-system'

const { isSidebarOpen, isFloatingSidebar } = useMainSidebar()

function toggleSidebar(): void {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <button @click="toggleSidebar">
    {{ isSidebarOpen ? 'Close' : 'Open' }} Sidebar
  </button>
  <p v-if="isFloatingSidebar">Sidebar is in floating (mobile) mode</p>
</template>
```

### Data-Driven Navigation

```vue
<script setup lang="ts">
import {
  UIMainSidebar,
  UIMainSidebarNavigationGroup,
  UIMainSidebarNavigationLink,
} from '@wisemen/vue-core-design-system'
import type {
  UIMainSidebarGroup,
} from '@wisemen/vue-core-design-system'
import { computed } from 'vue'

const groups = computed<UIMainSidebarGroup[]>(() => [
  {
    label: 'Main',
    links: [
      { icon: DashboardIcon, label: 'Dashboard', to: { name: 'dashboard' } },
      { icon: UsersIcon, label: 'Users', to: { name: 'users' } },
    ],
  },
])
</script>

<template>
  <UIMainSidebar>
    <template #navigation>
      <UIMainSidebarNavigationGroup
        v-for="group in groups"
        :key="group.label"
        :label="group.label"
      >
        <UIMainSidebarNavigationLink
          v-for="link in group.links"
          :key="link.label"
          :to="link.to"
          :icon="link.icon"
          :label="link.label"
        />
      </UIMainSidebarNavigationGroup>
    </template>
  </UIMainSidebar>
</template>
```

## Anatomy

```
UIMainSidebar
  (screen >= 960px, collapsedVariant='hidden')
    AnimatePresence
      MainSidebarTransition  Motion[translateX]
        MainSidebarContent
          div[padding=containerPadding]  #header slot
          nav[padding=containerPadding]  #navigation slot
          div[padding=containerPadding]  #footer slot

  (screen >= 960px, collapsedVariant='minified')
    Motion[width=sidebarWidth]  .absolute.h-full.overflow-hidden
      MainSidebarContent
        (same structure as above)

  (screen < 960px)
    DialogRoot
      AnimatePresence
        DialogContent[asChild]
          MainSidebarTransition  Motion[translateX]
            div .rounded-xl.border.bg-secondary.shadow-lg
              DialogTitle (sr-only)
              DialogDescription (sr-only)
              MainSidebarContent
                (same structure as above)
        DialogOverlay  Motion[opacity]  .bg-black/10

MainSidebarNavigationLink
  ActionTooltip[label, keyboardShortcut, side=right]
    ClickableElement
      RouterLink
        MainSidebarNavigationLinkProvider (context: isActive)
          div[data-active] .grid
            RowLayout (icon cell)
              Component[is=icon]
            MainSidebarFadeTransition
              RowLayout[justify=between]
                span (label)
                RowLayout (#right slot - badges, dots)

MainSidebarFooterAccountCard
  DropdownMenu[side=right, align=end]
    #trigger
      UICard .grid
        Avatar
        MainSidebarFadeTransition
          name + email + chevron
    #content
      DropdownMenuGroup (custom menu options)
      DropdownMenuGroup (sign out)
```

## Styling

**Style file:** No separate style file. Uses inline Tailwind classes throughout.

**Sidebar dimensions (from composable):**

| Token | Value | Description |
|-------|-------|-------------|
| Default width | `14rem` (224px) | Full sidebar width |
| Minified width | `3rem` (48px) | Icon-only collapsed width |
| Container padding | `0.5625rem` (9px) | Inner padding for header/nav/footer |
| Icon size | `1rem` (16px) | Navigation link icon size |
| Icon cell size | `1.875rem` (30px) | Grid cell containing the icon |
| Link height | `1.875rem` (30px) | Height of each navigation link |
| Logo height | `2.6rem` (41.6px) | Height of the logo row |

**Active link styling:** `bg-brand-primary` (light) / `bg-tertiary` (dark), with `text-fg-brand-primary` (light) / `text-fg-primary` (dark) for the icon and label.

**Transitions:** All open/close and fade transitions use `motion-v` spring animations (duration 0.3s, no bounce) with reduced-motion support. The `MainSidebarFadeTransition` uses CSS opacity transitions (150ms in, 100ms out) for label text fade.

## Common Mistakes

### HIGH: Forgetting to wrap sidebar in UIMainLayoutContainer

Wrong:
```vue
<UIMainSidebar>...</UIMainSidebar>
<div>Page content</div>
```

Correct:
```vue
<UIMainLayoutContainer>
  <UIMainSidebar>...</UIMainSidebar>
  <UIMainContent>
    <div>Page content</div>
  </UIMainContent>
</UIMainLayoutContainer>
```

The sidebar is absolutely positioned and needs `UIMainLayoutContainer` (which provides `h-dvh overflow-hidden`) to contain it. `UIMainContent` handles the animated padding that shifts content away from the sidebar.

### MEDIUM: Placing badges/dots outside the right slot

Wrong:
```vue
<UIMainSidebarNavigationLink :to="..." :icon="Icon" label="Projects" />
<UIMainSidebarNavigationLinkBadge label="5" />
```

Correct:
```vue
<UIMainSidebarNavigationLink :to="..." :icon="Icon" label="Projects">
  <template #right>
    <UIMainSidebarNavigationLinkBadge label="5" />
    <UIMainSidebarNavigationLinkStatusDot />
  </template>
</UIMainSidebarNavigationLink>
```

Badge and status dot components must be placed inside the `#right` slot of their parent `UIMainSidebarNavigationLink`. They rely on the navigation link context for active-state styling.

### MEDIUM: Not providing onSignOut to FooterAccountCard

Wrong:
```vue
<UIMainSidebarFooterAccountCard
  name="Jane Doe"
  email="jane@example.com"
  :menu-options="[]"
/>
```

Correct:
```vue
<UIMainSidebarFooterAccountCard
  name="Jane Doe"
  email="jane@example.com"
  :menu-options="[]"
  :on-sign-out="handleSignOut"
/>
```

The `onSignOut` prop is required. The sign-out menu item is always rendered and calls this callback.

### LOW: Using collapsedVariant='hidden' when minified is more appropriate

Consider using `'minified'` when you want users to always see navigation icons, even when the sidebar is collapsed. Use `'hidden'` only when you want the sidebar to disappear entirely (e.g., content-focused views).

## Accessibility

- **Floating mode (< 960px):** Uses `reka-ui` `DialogRoot` / `DialogContent` / `DialogOverlay` for proper focus trapping, backdrop click-to-close, and screen-reader semantics. Includes a `DialogTitle` and `DialogDescription` (both `sr-only`).
- **Sidebar toggle:** The header toggle in `DashboardPageHeaderSidebarToggle` uses `reka-ui Toggle` with dynamic `aria-label` ("collapse"/"expand") and a `Meta+B` keyboard shortcut tooltip.
- **Navigation links:** Each link renders as a `RouterLink` (which becomes an `<a>` element). The `data-active` attribute signals the active state. Tooltips with keyboard shortcuts are shown via `ActionTooltip`.
- **Account dropdown:** Uses `DropdownMenu` with proper focus management and keyboard navigation. Menu items support keyboard shortcuts.
- **Reduced motion:** All animations (slide, fade, width transitions) respect `prefers-reduced-motion` via `motion-v`'s `useReducedMotion`, setting duration to 0.
- **Keyboard navigation:** Links are focusable, the sidebar toggle is keyboard-accessible, and the dropdown menu supports full keyboard interaction.

## See Also

- [UILayout](../layout/) -- The outer shell (MainLayoutContainer + MainContent) that wraps the sidebar
- [UIDashboardPage](../page/) -- The page component rendered inside UIMainContent alongside the sidebar
- [UIDropdownMenu](../dropdown-menu/) -- Used internally by the account card
- [Layout System](../../foundations/layout-system/) -- Foundation overview of the full layout architecture
