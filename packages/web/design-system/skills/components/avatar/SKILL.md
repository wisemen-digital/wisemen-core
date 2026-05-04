---
name: avatar
description: >
  Avatar system with four components: UIAvatar (image or initials), UIAvatarGroup (stacked
  row with overflow), UIAvatarGroupAddButton (dashed add action), and UIAvatarLabel (avatar
  with name and supporting text). Load this skill when displaying user profile pictures,
  grouped users, or labeled identity elements.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UIAvatar
  - UIAvatarGroup
  - UIAvatarGroupAddButton
  - UIAvatarLabel
---

# UIAvatar

An avatar system for displaying user profile pictures with initials fallback, status indicators, and logo overlays. Includes group and labeled variants.

## When to Use

- Displaying user profile pictures or identity indicators
- Showing a group of users with an overflow count
- Presenting user information with name and supporting text alongside an avatar
- Any place where a person or entity needs a visual representation

**Use instead:** `UIBadge` with the `avatar` prop for inline avatar-with-text badges. Plain `<img>` when you do not need fallback initials or status indicators.

## Import

```ts
import {
  UIAvatar,
  UIAvatarGroup,
  UIAvatarGroupAddButton,
  UIAvatarLabel,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIAvatar } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAvatar name="Olivia Rhye" src="https://example.com/photo.jpg" />
</template>
```

---

## UIAvatar

Displays a circular avatar with an image, falling back to initials derived from the `name` prop. Optionally shows a status dot or a logo overlay.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **(required)** | The name used to generate fallback initials. |
| `imageAlt` | `string \| null` | `null` | Alt text for the avatar image. Defaults to `"Avatar"` when not provided. |
| `logo` | `string \| null` | `null` | Image URL for a logo overlay shown at the bottom-right corner. |
| `logoAlt` | `string \| null` | `null` | Alt text for the logo image. Defaults to `"Avatar Logo"` when not provided. |
| `size` | `'2xl' \| 'lg' \| 'md' \| 'sm' \| 'xl' \| 'xs' \| 'xxs'` | `'md'` | The size of the avatar. |
| `src` | `string \| null` | `null` | Image URL for the avatar. Falls back to initials when not provided or loading fails. |
| `status` | `'away' \| 'busy' \| 'offline' \| 'online' \| null` | `null` | Online status indicator shown as a colored dot at the bottom-right. Mutually exclusive with `logo`. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

### Sizes

| Size | Dimensions | Initials (count) | Status dot | Logo |
|------|-----------|-------------------|------------|------|
| `xxs` | 16x16 | 1 initial | `size-1.5` | `size-1.5` |
| `xs` | 24x24 | 2 initials | `size-2` | `size-2` |
| `sm` | 32x32 | 2 initials | `size-2.5` | `size-2.5` |
| `md` | 40x40 | 2 initials | `size-3` | `size-3` |
| `lg` | 48x48 | 2 initials | `size-3.5` | `size-3.5` |
| `xl` | 56x56 | 2 initials | `size-3.5` | `size-3.5` |
| `2xl` | 64x64 | 2 initials | `size-4` | `size-4` |

### Status Colors

| Status | Color |
|--------|-------|
| `online` | `bg-success-500` (green) |
| `away` | `bg-warning-500` (yellow) |
| `busy` | `bg-error-500` (red) |
| `offline` | `bg-gray-400` (gray) |

### Example: Avatar with Status

```vue
<script setup lang="ts">
import { UIAvatar } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAvatar
    name="Olivia Rhye"
    src="https://example.com/photo.jpg"
    status="online"
    size="lg"
  />
</template>
```

### Example: Avatar with Logo

```vue
<script setup lang="ts">
import { UIAvatar } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAvatar
    name="Olivia Rhye"
    src="https://example.com/photo.jpg"
    logo="https://example.com/company-logo.png"
    logo-alt="Wisemen"
    size="md"
  />
</template>
```

### Example: Fallback Initials

```vue
<script setup lang="ts">
import { UIAvatar } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Shows "OR" as fallback when no src is provided -->
  <UIAvatar name="Olivia Rhye" />
</template>
```

---

## UIAvatarGroup

Displays a horizontal stack of overlapping avatars with a "+X" overflow indicator when the count exceeds `max`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatars` | `AvatarProps[]` | **(required)** | Array of avatar prop objects (each with `name`, `src`, `logo`, etc.). |
| `max` | `number` | `10` | Maximum number of avatars to display before showing the overflow count. |
| `size` | `'md' \| 'sm' \| 'xs'` | `'sm'` | Size of all avatars in the group. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

### Example: Avatar Group

```vue
<script setup lang="ts">
import { UIAvatarGroup } from '@wisemen/vue-core-design-system'

const users = [
  { name: 'Alice', src: 'https://example.com/alice.jpg' },
  { name: 'Bob', src: 'https://example.com/bob.jpg' },
  { name: 'Charlie', src: 'https://example.com/charlie.jpg' },
  { name: 'Diana', src: 'https://example.com/diana.jpg' },
  { name: 'Eve', src: 'https://example.com/eve.jpg' },
]
</script>

<template>
  <UIAvatarGroup :avatars="users" :max="3" size="sm" />
</template>
```

---

## UIAvatarGroupAddButton

A circular dashed-border button placed next to a `UIAvatarGroup` for adding new members. Shows a "+" icon (or a loader when loading).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **(required)** | Accessible text label for the button (used as `aria-label`). |
| `disabledReason` | `string \| null` | `null` | Tooltip text shown when the button is disabled. |
| `form` | `string \| null` | `null` | The form ID the button is associated with. |
| `isDisabled` | `boolean` | `false` | Disables the button. |
| `isLoading` | `boolean` | `false` | Shows a loading spinner and prevents interaction. |
| `isTooltipDisabled` | `boolean` | `false` | Disables the tooltip. When disabled and `disabledReason` is set, the tooltip still shows. |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut shown in the tooltip. |
| `size` | `'md' \| 'sm' \| 'xs'` | `'sm'` | Button size. Should match the `UIAvatarGroup` size. |
| `tooltipLabel` | `string \| null` | `null` | Custom tooltip text. Defaults to the `label` prop value. |
| `type` | `'button' \| 'reset' \| 'submit'` | `'button'` | Native button type attribute. |

### Slots

This component has no slots.

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted when the button is clicked (not emitted while loading). |

### Example: Group with Add Button

```vue
<script setup lang="ts">
import { UIAvatarGroup, UIAvatarGroupAddButton } from '@wisemen/vue-core-design-system'

const users = [
  { name: 'Alice', src: 'https://example.com/alice.jpg' },
  { name: 'Bob', src: 'https://example.com/bob.jpg' },
]

function onAddUser(): void {
  // open user picker
}
</script>

<template>
  <div class="flex items-center gap-md">
    <UIAvatarGroup :avatars="users" size="sm" />
    <UIAvatarGroupAddButton label="Add user" size="sm" @click="onAddUser" />
  </div>
</template>
```

---

## UIAvatarLabel

Displays an avatar alongside a name and optional supporting text. Useful in user lists, profiles, and mentions.

### Props

Inherits all `UIAvatar` props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **(required)** | The user's name, shown as text and used for avatar initials. |
| `supportingText` | `string \| null` | `null` | Secondary text displayed below the name (e.g., email, role). |
| `size` | `'2xl' \| 'lg' \| 'md' \| 'sm' \| 'xl' \| 'xs' \| 'xxs'` | `'md'` | Controls both the avatar size and the text sizing. |
| `src` | `string \| null` | `null` | Avatar image URL. |
| `logo` | `string \| null` | `null` | Logo overlay URL. |
| `logoAlt` | `string \| null` | `null` | Alt text for the logo. |
| `status` | `'away' \| 'busy' \| 'offline' \| 'online' \| null` | `null` | Status indicator on the avatar. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

### Size-specific Text Sizing

| Size | Name font | Supporting text font | Gap |
|------|-----------|---------------------|-----|
| `xxs` | `text-xs` | `text-xs` | `gap-md` |
| `xs` | `text-xs` | `text-xs` | `gap-md` |
| `sm` | `text-sm` | `text-xs` | `gap-md` |
| `md` | `text-sm` | `text-sm` | `gap-md` |
| `lg` | `text-md` | `text-md` | `gap-lg` |
| `xl` | `text-lg` | `text-md` | `gap-xl` |
| `2xl` | `text-lg` | `text-md` | `gap-xl` |

### Example: User Profile Row

```vue
<script setup lang="ts">
import { UIAvatarLabel } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAvatarLabel
    name="Olivia Rhye"
    src="https://example.com/photo.jpg"
    supporting-text="olivia@wisemen.digital"
    size="md"
    status="online"
  />
</template>
```

### Example: With Logo

```vue
<script setup lang="ts">
import { UIAvatarLabel } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAvatarLabel
    name="Olivia Rhye"
    src="https://example.com/photo.jpg"
    logo="https://example.com/company-logo.png"
    supporting-text="olivia@wisemen.digital"
    size="md"
  />
</template>
```

---

## Anatomy

```
UIAvatar
  div.relative.inline-block       (root)
    AvatarRoot[as-child]           (Reka UI)
      AvatarImage                  (shown when src loads)
      AvatarFallback               (initials when no image)
    span.statusDot?                (when status is set)
    img.logo?                      (when logo is set, mutually exclusive with status)

UIAvatarGroup
  div.flex                         (root)
    Avatar * N                     (overlapping, negative margin)
    div.overflow?                  ("+X" count when avatars.length > max)

UIAvatarGroupAddButton
  ActionTooltip
    button.rounded-full.border-dashed
      Loader | PlusIcon

UIAvatarLabel
  div.flex.items-center            (root)
    Avatar                         (avatar)
    ColumnLayout                   (text container)
      Text                         (name)
      Text?                        (supportingText)
```

## Styling

**Style files:**
- `src/ui/avatar/avatar/avatar.style.ts` -- UIAvatar
- `src/ui/avatar/avatar-group/avatarGroup.style.ts` -- UIAvatarGroup
- `src/ui/avatar/avatar-group/avatarGroupAddButton.style.ts` -- UIAvatarGroupAddButton
- `src/ui/avatar/avatar-label/avatarLabel.style.ts` -- UIAvatarLabel

**UIAvatar tv() slots:** `base`, `fallBack`, `logo`, `root`, `statusDot`
**UIAvatarGroup tv() slots:** `avatar`, `overflow`, `root`
**UIAvatarGroupAddButton tv() slots:** `icon`, `root`
**UIAvatarLabel tv() slots:** `name`, `root`, `supportingText`, `textContainer`

## Common Mistakes

### HIGH: Using status and logo simultaneously

Wrong:
```vue
<UIAvatar
  name="Jane"
  status="online"
  logo="https://example.com/logo.png"
/>
```

Correct:
```vue
<!-- Use one or the other -->
<UIAvatar name="Jane" status="online" />
<UIAvatar name="Jane" logo="https://example.com/logo.png" />
```

The status dot and logo both render at the bottom-right corner. Only one can be displayed at a time. The template uses `v-if/v-else-if` so `status` takes priority.

### MEDIUM: Mismatched sizes between AvatarGroup and AvatarGroupAddButton

Wrong:
```vue
<div class="flex items-center gap-md">
  <UIAvatarGroup :avatars="users" size="sm" />
  <UIAvatarGroupAddButton label="Add" size="md" />
</div>
```

Correct:
```vue
<div class="flex items-center gap-md">
  <UIAvatarGroup :avatars="users" size="sm" />
  <UIAvatarGroupAddButton label="Add" size="sm" />
</div>
```

The `size` prop on `UIAvatarGroupAddButton` should match the `UIAvatarGroup` size for visual consistency.

### LOW: Not providing imageAlt for accessible avatars

Wrong:
```vue
<UIAvatar name="Jane" src="https://example.com/photo.jpg" />
```

Correct:
```vue
<UIAvatar
  name="Jane"
  src="https://example.com/photo.jpg"
  image-alt="Jane's profile picture"
/>
```

When `imageAlt` is not provided, it defaults to the generic `"Avatar"`. Provide a descriptive alt text for better accessibility.

## Accessibility

- `UIAvatar` uses Reka UI's `AvatarRoot`, `AvatarImage`, and `AvatarFallback` which handle image loading states and fallback accessibility.
- The avatar image receives an `alt` attribute from `imageAlt` (defaulting to `"Avatar"`).
- The logo image receives an `alt` attribute from `logoAlt` (defaulting to `"Avatar Logo"`).
- `UIAvatarGroupAddButton` sets `aria-label` from the `label` prop, and uses `aria-busy` and `aria-disabled` during loading.
- `UIAvatarGroup` overflow count is announced via i18n-translated text (`component.avatar_group.overflow`).

## See Also

- [UIBadge](../badge/) -- Badge with optional avatar for inline tagged representations
- [UINumberBadge](../number-badge/) -- Numeric badge for counts
