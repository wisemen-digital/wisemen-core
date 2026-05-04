---
name: tabs
description: >
  UITabs provides value-based tabbed navigation, while UITabsRouterLink provides
  route-based tabbed navigation integrated with Vue Router. Both support three
  visual variants (underline, button-border, button-brand), horizontal and vertical
  orientations, full-width mode, adaptive overflow (hiding low-priority tabs into
  a dropdown), and scroll-based overflow for touch devices.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: navigation
requires: []
exports:
  - UITabs
  - UITabsProps
  - UITabsItem
  - UITabsItemProps
  - UITabsList
  - UITabsContent
  - UITabsContentProps
  - UITabsRouterLink
  - UITabsRouterLinkItem
  - UITabsRouterLinkItemProps
---

# UITabs

Tabbed navigation with value-based and router-link modes, three visual variants, adaptive overflow, and vertical/horizontal orientations.

## When to Use

- Switching between content panels within a page section (value-based mode with `UITabs`).
- Route-based tab navigation where each tab maps to a named route (with `UITabsRouterLink`).
- When tabs may overflow the container and need adaptive collapsing into a dropdown.

**Use instead:** For top-level app navigation, use `UISidebar`. For breadcrumb-style hierarchical navigation, use `UIBreadcrumbs`.

## Import

```ts
// Value-based tabs
import {
  UITabs,
  UITabsList,
  UITabsItem,
  UITabsContent,
} from '@wisemen/vue-core-design-system'

// Router-link tabs
import {
  UITabsRouterLink,
  UITabsRouterLinkItem,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

### Value-based tabs

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UITabs,
  UITabsList,
  UITabsItem,
  UITabsContent,
} from '@wisemen/vue-core-design-system'
import { User01Icon, Settings01Icon } from '@wisemen/vue-core-icons'

const selectedTab = ref<string>('general')
</script>

<template>
  <UITabs v-model="selectedTab" variant="underline">
    <UITabsList>
      <UITabsItem :icon="User01Icon" label="General" value="general" />
      <UITabsItem :icon="Settings01Icon" label="Settings" value="settings" />
    </UITabsList>

    <UITabsContent value="general">
      <p>General content.</p>
    </UITabsContent>
    <UITabsContent value="settings">
      <p>Settings content.</p>
    </UITabsContent>
  </UITabs>
</template>
```

### Router-link tabs

```vue
<script setup lang="ts">
import {
  UITabsRouterLink,
  UITabsRouterLinkItem,
} from '@wisemen/vue-core-design-system'
import { User01Icon, Inbox02Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UITabsRouterLink variant="underline">
    <UITabsRouterLinkItem :icon="User01Icon" :to="{ name: 'general' }" label="General" />
    <UITabsRouterLinkItem :icon="Inbox02Icon" :to="{ name: 'members' }" label="Members" />
  </UITabsRouterLink>

  <!-- Content is rendered by the router via TabsRouterLinkContent -->
</template>
```

## API

### UITabs Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | **(required, v-model)** | The currently selected tab value. |
| `variant` | `'underline' \| 'button-border' \| 'button-brand'` | `'underline'` | Visual style of the tabs. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `isFullWidth` | `boolean` | `false` | Whether tabs stretch to fill the container width. |
| `underlineTabsHorizontalListPadding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'none'` | Horizontal padding of the scroll container. Only applies to the `underline` variant. |

### UITabsItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **(required)** | Unique identifier for the tab. |
| `label` | `string` | **(required)** | Text label for the tab. |
| `icon` | `Component` | `undefined` | Optional icon displayed alongside the label. |
| `count` | `number \| null` | `null` | Badge count displayed to the right of the label. |
| `isDisabled` | `boolean` | `false` | Disables the tab. |
| `disabledReason` | `string \| null` | `null` | Tooltip text when the tab is disabled. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label (sr-only). |

### UITabsList

No props. Renders the tab list with scroll overflow handling and adaptive content support. On non-touch devices, uses `UIAdaptiveContent` to collapse overflow tabs into a dropdown. On touch devices, shows scroll arrows.

### UITabsContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **(required)** | The tab value this content panel corresponds to. |

### UITabsContent Slots

| Slot | Description |
|------|-------------|
| `default` | The content displayed when this tab is active. |

### UITabsRouterLink Props

Same as `UITabs` Props except there is no `modelValue` -- the active tab is derived from the current route name.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'underline' \| 'button-border' \| 'button-brand'` | `'underline'` | Visual style. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `isFullWidth` | `boolean` | `false` | Stretch tabs to fill width. |
| `underlineTabsHorizontalListPadding` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'none'` | Scroll container padding (underline variant only). |

### UITabsRouterLinkItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `RouteLocationRaw` | **(required)** | Vue Router destination. The resolved route name is used as the tab value. |
| `label` | `string` | **(required)** | Text label for the tab. |
| `icon` | `Component` | `undefined` | Optional icon. |
| `count` | `number \| null` | `null` | Badge count. |
| `isDisabled` | `boolean` | `false` | Disables the tab. |
| `disabledReason` | `string \| null` | `null` | Tooltip text when disabled. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label (sr-only). |

### Emits

**UITabs:** `update:modelValue` (via v-model)

**UITabsRouterLink:** No custom events. Navigation is handled via `router.replace()`.

## Variants

### Visual variants

| Variant | Description |
|---------|-------------|
| `underline` | Bottom border indicator, brand-colored underline on active tab. Border below the list. |
| `button-border` | Pill-style tabs in a gray background container. Active tab has a raised white card indicator with shadow. |
| `button-brand` | Pill-style tabs with brand-colored background on active tab. |

### Orientations

| Orientation | Description |
|-------------|-------------|
| `horizontal` | Tabs in a row. Indicator slides horizontally. Scroll overflow on touch devices. |
| `vertical` | Tabs in a column. Indicator slides vertically. Left border for underline variant. |

### Full width

When `isFullWidth` is `true`, each tab gets `flex-1 justify-center` to stretch evenly.

## Examples

### Button-border variant with count badges

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITabs, UITabsList, UITabsItem, UITabsContent } from '@wisemen/vue-core-design-system'
import { Inbox02Icon } from '@wisemen/vue-core-icons'

const tab = ref<string>('inbox')
</script>

<template>
  <UITabs v-model="tab" variant="button-border">
    <UITabsList>
      <UITabsItem :icon="Inbox02Icon" :count="12" label="Inbox" value="inbox" />
      <UITabsItem label="Sent" value="sent" />
      <UITabsItem :is-disabled="true" disabled-reason="Coming soon" label="Drafts" value="drafts" />
    </UITabsList>

    <UITabsContent value="inbox">Inbox content.</UITabsContent>
    <UITabsContent value="sent">Sent content.</UITabsContent>
  </UITabs>
</template>
```

### Vertical underline tabs

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UITabs, UITabsList, UITabsItem, UITabsContent } from '@wisemen/vue-core-design-system'

const tab = ref<string>('general')
</script>

<template>
  <div class="flex gap-4">
    <UITabs v-model="tab" variant="underline" orientation="vertical">
      <UITabsList>
        <UITabsItem label="General" value="general" />
        <UITabsItem label="Security" value="security" />
        <UITabsItem label="Notifications" value="notifications" />
      </UITabsList>
    </UITabs>

    <UITabsContent value="general">General settings.</UITabsContent>
  </div>
</template>
```

### Router-link tabs with content

```vue
<script setup lang="ts">
import {
  UITabsRouterLink,
  UITabsRouterLinkItem,
} from '@wisemen/vue-core-design-system'
import { User01Icon, Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UITabsRouterLink variant="underline">
    <UITabsRouterLinkItem :icon="User01Icon" :to="{ name: 'profile' }" label="Profile" />
    <UITabsRouterLinkItem :icon="Settings01Icon" :to="{ name: 'settings' }" label="Settings" />
  </UITabsRouterLink>

  <!-- Router view renders the matched route component -->
  <RouterView />
</template>
```

Note: `UITabsRouterLink` includes a `TabsList` internally; do not wrap items in a separate `UITabsList`.

## Anatomy

```
UITabs (value-based)
  RekaTabsRoot (v-model)
    UITabsList
      <div> (base wrapper, overflow hidden)
        Scroll left button (touch devices, when scrolled)
        <div> (scroll container)
          UIAdaptiveContent (non-touch devices)
            RekaTabsList
              UITabsItem (wrapped in UIAdaptiveContentBlock)
                UIActionTooltip (for disabled reason)
                  ClickableElement > RekaTabsTrigger
                    Icon (optional)
                    UIText (label)
                    UINumberBadge (count, optional)
              TabsIndicator (animated position indicator)
              TabsAdaptiveContentDropdown (overflow items)
          RekaTabsList (touch devices, no adaptive content)
            UITabsItem
            RekaTabsIndicator
        Scroll right button (touch devices, when overflowing)
    UITabsContent
      RekaTabsContent
        slot[default]

UITabsRouterLink (route-based)
  RekaTabsRoot (model from route name)
    TabsList (embedded, same structure as above)
      UITabsRouterLinkItem
        UIAdaptiveContentBlock
          ClickableElement > RekaTabsTrigger (as-child)
            RouterLink (:replace="true")
              Icon (optional)
              UIText (label)
              UINumberBadge (count, optional)
```

## Styling

**Style file:** `src/ui/tabs/tabs.style.ts`

**tv() slots:** `base`, `list`, `scrollContainer`, `item`, `indicator`, `indicatorInner`, `content`, `dropdownTrigger`, `dropdownIndicator`

**Variant axes:** `variant` (`underline` | `button-border` | `button-brand`), `isFullWidth` (boolean), `underlineTabsHorizontalListPadding` (`none` | `sm` | `md` | `lg` | `xl`)

**Key styling details:**
- `underline` variant: bottom border on scroll container, `h-0.5` brand indicator, items get `rounded-md px-md py-xxs` with vertical margins
- `button-border` variant: list has `bg-tertiary` background, indicator shows raised white card with `shadow-sm`, items have `rounded-sm px-lg py-sm`
- `button-brand` variant: indicator is `bg-brand-primary-alt`, active text is `text-brand-secondary`

## Common Mistakes

### ERROR: Using UITabsList inside UITabsRouterLink

```vue
<!-- WRONG: UITabsRouterLink includes TabsList internally -->
<UITabsRouterLink>
  <UITabsList>
    <UITabsRouterLinkItem ... />
  </UITabsList>
</UITabsRouterLink>

<!-- CORRECT -->
<UITabsRouterLink>
  <UITabsRouterLinkItem :to="{ name: 'general' }" label="General" />
  <UITabsRouterLinkItem :to="{ name: 'settings' }" label="Settings" />
</UITabsRouterLink>
```

`UITabsRouterLink` renders its own `TabsList` internally. Wrapping items in another `UITabsList` causes double nesting.

### ERROR: Mismatched value and content

```vue
<!-- WRONG: content value doesn't match any tab -->
<UITabsItem label="General" value="tab1" />
<UITabsContent value="general">...</UITabsContent>

<!-- CORRECT: values must match exactly -->
<UITabsItem label="General" value="general" />
<UITabsContent value="general">...</UITabsContent>
```

### WARNING: underlineTabsHorizontalListPadding with non-underline variant

```vue
<!-- WRONG: padding prop only applies to underline variant -->
<UITabs variant="button-border" underline-tabs-horizontal-list-padding="lg">

<!-- CORRECT -->
<UITabs variant="underline" underline-tabs-horizontal-list-padding="lg">
```

A console warning is emitted if `underlineTabsHorizontalListPadding` is set to a value other than `'none'` with a non-underline variant.

### WARNING: Forgetting v-model on UITabs

```vue
<!-- WRONG: no v-model, tabs won't switch -->
<UITabs variant="underline">

<!-- CORRECT -->
<UITabs v-model="selectedTab" variant="underline">
```

## Accessibility

- Built on Reka UI's Tabs primitives which implement the WAI-ARIA Tabs pattern.
- **Roles:** `tablist`, `tab`, `tabpanel` are automatically applied.
- **Keyboard:** Arrow keys navigate between tabs, Tab moves focus out of the tab list, Enter/Space activates.
- **aria-selected:** Active tab has `aria-selected="true"`.
- **Disabled tabs:** Set via `isDisabled` with `disabled` attribute. `disabledReason` shows a tooltip on hover.
- **Router-link tabs:** Use `<RouterLink>` with `replace` mode for proper link semantics. The `RekaTabsTrigger` wraps the link with `as-child` to merge accessibility attributes.
- **Adaptive overflow:** Hidden tabs are accessible via the dropdown menu, which inherits keyboard navigation from the dropdown menu primitives.

## See Also

- [adaptive-content](../adaptive-content/SKILL.md) -- The priority-based overflow system used by TabsList
- [breadcrumbs](../breadcrumbs/SKILL.md) -- Hierarchical navigation
- [dropdown-menu](../dropdown-menu/SKILL.md) -- Used internally for overflow tab items
- [button](../button/SKILL.md) -- For standalone action triggers
