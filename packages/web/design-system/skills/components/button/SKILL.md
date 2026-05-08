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

For full API details, read the props files. For usage examples, read the playground files.

- Props: `src/ui/button/button/button.props.ts`, `src/ui/button/icon/iconButton.props.ts`, `src/ui/button/link/link.props.ts`
- Components: `src/ui/button/button/Button.vue`, `src/ui/button/icon/IconButton.vue`, `src/ui/button/link/Link.vue`
- Playgrounds: `src/ui/button/button/stories/`, `src/ui/button/icon/stories/`, `src/ui/button/link/stories/`

## See Also

- [dropdown-menu](../dropdown-menu/SKILL.md) -- Often triggered by a button
- [menu-item](../menu-item/SKILL.md) -- Content layout inside dropdown menus
- [tabs](../tabs/SKILL.md) -- Tab triggers share similar styling patterns
