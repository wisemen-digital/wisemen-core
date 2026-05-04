---
name: logo
description: >
  Displays a brand or app logo image with optional text label. UILogo renders a
  sized image with fallback placeholder on error. UILogoWithText combines the logo
  with a name label. Load this skill for brand identity elements in headers or
  sidebars.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UILogo
  - UILogoWithText
---

# UILogo

Renders a logo image at a fixed size with rounded corners and a fallback placeholder when the image fails to load.

## When to Use

- Displaying a brand or company logo in a sidebar, header, or navigation
- Showing a tenant or workspace logo
- Anywhere a small logo image is needed with graceful error handling

**Use instead:** `UIAvatar` for user profile images with initials fallback.

## Import

```ts
import { UILogo, UILogoWithText } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UILogo } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILogo src="/logo.png" alt="Company Logo" size="sm" />
</template>
```

## API

### UILogo Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **(required)** | The image source URL for the logo. |
| `alt` | `string` | **(required)** | Accessible alt text for the logo image. |
| `size` | `'3xs' \| 'xxs' \| 'xs' \| 'sm'` | **(required)** | The size of the logo. |

### UILogoWithText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| null` | **(required)** | The image source URL for the logo. When `null`, only the text is displayed. |
| `name` | `string` | **(required)** | The name displayed next to the logo. |
| `size` | `'xxs' \| 'xs' \| 'sm'` | **(required)** | The size of the logo and text. |

### Slots

These components have no slots.

### Emits

These components have no custom events.

## Variants

### UILogo Sizes

| Size | Dimensions | Border Radius |
|------|-----------|---------------|
| `3xs` | `size-3.5` (14px) | `rounded-xs` |
| `xxs` | `size-5` (20px) | `rounded-sm` |
| `xs` | `size-6` (24px) | `rounded-md` |
| `sm` | `size-8` (32px) | `rounded-lg` |

### UILogoWithText Sizes

| Size | Logo Size | Text Size |
|------|-----------|-----------|
| `xxs` | `size-5` | `text-xs` |
| `xs` | `size-6` | `text-sm` |
| `sm` | `size-8` | `text-xl` |

Note: UILogoWithText does not support the `3xs` size.

## Examples

### Basic Logo

```vue
<script setup lang="ts">
import { UILogo } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILogo src="/logo.png" alt="Acme Corp" size="sm" />
</template>
```

### Logo with Text

```vue
<script setup lang="ts">
import { UILogoWithText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILogoWithText src="/logo.png" name="Acme Corp" size="sm" />
</template>
```

### Logo with Text, No Image

```vue
<script setup lang="ts">
import { UILogoWithText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILogoWithText :src="null" name="Acme Corp" size="xs" />
</template>
```

### All Logo Sizes

```vue
<script setup lang="ts">
import { UILogo } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-md">
    <UILogo src="/logo.png" alt="Logo 3xs" size="3xs" />
    <UILogo src="/logo.png" alt="Logo xxs" size="xxs" />
    <UILogo src="/logo.png" alt="Logo xs" size="xs" />
    <UILogo src="/logo.png" alt="Logo sm" size="sm" />
  </div>
</template>
```

## Anatomy

```
UILogo
├── <div>  (fallback placeholder, shown on image error)
└── <img>  (logo image with object-contain)

UILogoWithText
└── UIRowLayout (gap="md")
    ├── Logo  (conditionally rendered if src !== null)
    └── <span>  (name text, font-semibold text-secondary)
```

## Styling

**Style file:** None (styles are inline Tailwind classes)
**tv() slots:** None
**Customization:** UILogo uses `shrink-0` and `object-contain` with size-specific classes. The image has a subtle gradient background in dark mode (`dark:bg-primary-solid dark:bg-linear-to-b`). The error fallback renders a `bg-quaternary` placeholder div with the same size and border radius. UILogoWithText uses `UIRowLayout` with `gap="md"` and renders the name in `font-semibold text-secondary`.

## Common Mistakes

### HIGH: Using UILogoWithText size "3xs"

Wrong:
```vue
<!-- 3xs is only available on UILogo, not UILogoWithText -->
<UILogoWithText src="/logo.png" name="Brand" size="3xs" />
```

Correct:
```vue
<UILogoWithText src="/logo.png" name="Brand" size="xxs" />
```

UILogoWithText only supports `'xxs' | 'xs' | 'sm'`. The `3xs` size is only available on UILogo.

### MEDIUM: Missing alt text on UILogo

Wrong:
```vue
<UILogo src="/logo.png" alt="" size="sm" />
```

Correct:
```vue
<UILogo src="/logo.png" alt="Company Name Logo" size="sm" />
```

The `alt` prop is required and should describe the logo for screen readers.

## Accessibility

UILogo renders an `<img>` element with the `alt` prop mapped directly to the HTML `alt` attribute. When the image fails to load, a plain `<div>` placeholder is shown. There is no keyboard interaction. UILogoWithText displays the name as visible text, providing an additional text alternative alongside the image.

## See Also

- [UIAvatar](../avatar/SKILL.md) -- For user profile images with initials fallback
- [UISidebar](../sidebar/SKILL.md) -- Common placement for logos in app navigation
