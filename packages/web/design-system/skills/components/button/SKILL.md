---
name: button
description: >
  UIButton, UIIconButton, and UILink -- the three action trigger variants.
  UIButton renders a labeled button, UIIconButton renders an icon-only button
  with an accessible label, and UILink renders a navigation element styled
  like a button using either Vue Router or a plain anchor.
type: component
library: vue-core-design-system
category: button
requires: []
exports:
  - UIButton
  - UIIconButton
  - UILink
---

# UIButton / UIIconButton / UILink

Three variants of the button primitive: labeled button, icon-only button, and navigation link styled as a button.

## When to Use

- **UIButton** -- Primary action trigger with a visible text label (forms, dialogs, toolbars).
- **UIIconButton** -- Compact icon-only action (toolbar buttons, close buttons, inline actions).
- **UILink** -- Navigation that should look like a button (external links, router links).

**Use instead:** Use `UILink` over a raw `<a>` or `<RouterLink>` when you want button styling. Use `UIIconButton` instead of `UIButton` when space is tight and the icon is universally understood.

## Import

```ts
import { UIButton, UIIconButton, UILink } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIButton, UIIconButton, UILink } from '@wisemen/vue-core-design-system'
import { Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIButton label="Save" variant="primary" @click="onSave" />

  <UIIconButton :icon="Settings01Icon" label="Settings" variant="secondary" />

  <UILink label="Learn More" :link="{ href: 'https://example.com', target: '_blank' }" />
</template>
```

## Source Files

- Props: `src/ui/button/button/button.props.ts`, `src/ui/button/icon/iconButton.props.ts`, `src/ui/button/link/link.props.ts`
- Styles: `src/ui/button/button/button.style.ts`, `src/ui/button/icon/iconButton.style.ts`, `src/ui/button/link/link.style.ts`
- Components: `src/ui/button/button/Button.vue`, `src/ui/button/icon/IconButton.vue`, `src/ui/button/link/Link.vue`

## Examples

### Button with icons

```vue
<script setup lang="ts">
import { UIButton } from '@wisemen/vue-core-design-system'
import { PlusIcon, ArrowRightIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIButton
    :icon-left="PlusIcon"
    label="Add Item"
    variant="primary"
  />

  <UIButton
    :icon-right="ArrowRightIcon"
    label="Next Step"
    variant="secondary"
  />
</template>
```

### Loading and disabled states

```vue
<script setup lang="ts">
import { UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIButton
    :is-loading="true"
    label="Saving..."
    variant="primary"
  />

  <UIButton
    :is-disabled="true"
    disabled-reason="You do not have permission."
    label="Delete"
    variant="destructive-primary"
  />
</template>
```

### Link with Vue Router

```vue
<script setup lang="ts">
import { UILink } from '@wisemen/vue-core-design-system'
import { ExternalLinkIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UILink
    label="Go to Dashboard"
    :to="{ name: 'dashboard' }"
    variant="primary"
  />

  <UILink
    label="Documentation"
    :icon-right="ExternalLinkIcon"
    :link="{ href: 'https://docs.example.com', target: '_blank', rel: 'noopener' }"
    variant="tertiary"
  />
</template>
```

## See Also

- [dropdown-menu](../dropdown-menu/SKILL.md) -- Often triggered by a button
- [menu-item](../menu-item/SKILL.md) -- Content layout inside dropdown menus
- [tabs](../tabs/SKILL.md) -- Tab triggers share similar styling patterns
