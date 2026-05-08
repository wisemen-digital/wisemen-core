---
name: badge
description: >
  Versatile badge component with support for labels, icons, dots, avatars, and separators. Includes BadgeGroup for wrapping collections and BadgeGroupTruncate for overflow handling.
type: component
library: vue-core-design-system
category: display
exports:
  - UIBadge
  - UIBadgeGroup
  - UIBadgeGroupTruncate
  - UIBadgeDot
  - UIBadgeIcon
  - UIBadgeLabel
  - UIBadgeSeparator
---

# UIBadge

A versatile badge component for displaying status labels, tags, and categorization indicators.

## Import

```ts
import { UIBadge, UIBadgeGroup, UIBadgeGroupTruncate } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIBadge label="Active" color="success" />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/badge/badge.props.ts`
- Component: `src/ui/badge/Badge.vue`
- Playground: `src/ui/badge/stories/`

## See Also

- [number-badge](../number-badge/SKILL.md)
- [dot](../dot/SKILL.md)
