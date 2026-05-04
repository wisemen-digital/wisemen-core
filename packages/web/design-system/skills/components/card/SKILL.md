---
name: card
description: >
  Simple bordered container with rounded corners for grouping related content.
  Has no props -- content goes in the default slot. Load this skill when you need
  a visual card or panel wrapper.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UICard
---

# UICard

A minimal bordered container with rounded corners for visually grouping related content.

## When to Use

- Wrapping a section of content in a visual card (e.g., settings panel, detail section)
- Creating bordered containers for dashboard widgets or info blocks
- Grouping form fields or related items into a distinct visual area

**Use instead:** A plain `<div>` with custom border classes for non-standard card designs, or `UIDialog` for modal content.

## Import

```ts
import { UICard } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <p>Card content goes here</p>
  </UICard>
</template>
```

## API

### Props

This component has no props.

### Slots

| Slot | Description |
|------|-------------|
| `default` | The content rendered inside the card container. |

### Emits

This component has no custom events.

## Variants

This component has no variants. It renders a single styled container.

## Examples

### Basic Card with Content

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <h3 class="text-lg font-semibold text-primary">Card Title</h3>
      <p class="mt-sm text-sm text-secondary">
        This is some descriptive content inside a card.
      </p>
    </div>
  </UICard>
</template>
```

### Card with Sections Separated by Dividers

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
import { UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <h3 class="text-lg font-semibold text-primary">Header</h3>
    </div>
    <UISeparator />
    <div class="p-xl">
      <p class="text-sm text-secondary">Body content</p>
    </div>
    <UISeparator />
    <div class="flex justify-end p-xl">
      <span class="text-sm text-tertiary">Footer</span>
    </div>
  </UICard>
</template>
```

## Anatomy

```
UICard
└── <div class="rounded-lg border border-secondary">
    └── <slot />  (default slot)
```

## Styling

**Style file:** None (styles are inline Tailwind classes)
**tv() slots:** None
**Customization:** UICard applies `rounded-lg border border-secondary` to its root `<div>`. To customize, pass a `class` attribute to override or extend styles. Note that UICard has no padding -- you must add padding to the slot content yourself (e.g., `p-xl`).

## Common Mistakes

### MEDIUM: Expecting built-in padding

Wrong:
```vue
<!-- Content touches the card border with no spacing -->
<UICard>
  <p>Content without padding</p>
</UICard>
```

Correct:
```vue
<UICard>
  <div class="p-xl">
    <p>Content with padding</p>
  </div>
</UICard>
```

UICard intentionally has no padding so you can compose sections with different padding or use separators edge-to-edge. Always add padding to your slot content.

## Accessibility

UICard renders a plain `<div>` with no ARIA attributes. It is a purely visual container. If the card represents a distinct region, add `role="region"` and `aria-label` on the card or its content for screen reader context.

## See Also

- [UISeparator](../separator/SKILL.md) -- For dividing sections within a card
- [UIColumnLayout](../column-layout/SKILL.md) -- For stacking content vertically inside a card
