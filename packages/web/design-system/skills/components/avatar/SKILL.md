---
name: avatar
description: >
  Avatar system with four components: UIAvatar (image or initials), UIAvatarGroup (stacked
  row with overflow), UIAvatarGroupAddButton (dashed add action), and UIAvatarLabel (avatar
  with name and supporting text).
type: component
library: vue-core-design-system
category: display
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

**Use instead:** `UIBadge` with the `avatar` prop for inline avatar-with-text badges. `UILogo` for brand/company logos.

## Import

```ts
import { UIAvatar, UIAvatarGroup, UIAvatarGroupAddButton, UIAvatarLabel } from '@wisemen/vue-core-design-system'
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

## Source Files

For full API details, read the props files. For usage examples, read the playground files.

- Props: `src/ui/avatar/avatar/avatar.props.ts`, `src/ui/avatar/avatar-group/avatarGroup.props.ts`, `src/ui/avatar/avatar-label/avatarLabel.props.ts`
- Components: `src/ui/avatar/avatar/Avatar.vue`, `src/ui/avatar/avatar-group/AvatarGroup.vue`, `src/ui/avatar/avatar-label/AvatarLabel.vue`
- Playground: `src/ui/avatar/avatar/stories/`, `src/ui/avatar/avatar-group/stories/`, `src/ui/avatar/avatar-label/stories/`

## See Also

- [badge](../badge/SKILL.md) -- For labeled status tags with optional avatar
- [logo](../logo/SKILL.md) -- For brand/company logos
