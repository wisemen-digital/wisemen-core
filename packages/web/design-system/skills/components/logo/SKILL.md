---
name: logo
description: >
  Displays a brand or app logo image with optional text label. UILogo renders a
  sized image with fallback placeholder on error. UILogoWithText combines the logo
  with a name label. Load this skill for brand identity elements in headers or
  sidebars.
type: component
library: vue-core-design-system
category: display
exports:
  - UILogo
  - UILogoWithText
---

# UILogo / UILogoWithText

Renders a logo image at a fixed size with rounded corners and a fallback placeholder when the image fails to load. `UILogoWithText` combines the logo with a name label.

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
import { UILogo, UILogoWithText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILogo src="/logo.png" alt="Company Logo" size="sm" />

  <UILogoWithText src="/logo.png" alt="Company Logo" name="Wisemen" size="sm" />
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/logo/logo.props.ts`
- Components: `src/ui/logo/Logo.vue`, `src/ui/logo/LogoWithText.vue`

## See Also

- [avatar](../avatar/SKILL.md) -- For user profile images with initials fallback
- [sidebar](../sidebar/SKILL.md) -- Sidebar header often uses UILogoWithText
