<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/sidebar/stories/playground.vue'

</script>

# Sidebar

Application sidebar shell for primary navigation and workspace structure.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-sidebar--default)

## Usage

`UIMainSidebar` provides the responsive sidebar shell. Use its named slots to place a logo/branding in `#header`, navigation items in `#navigation`, secondary links in `#bottom-navigation`, and a user profile area in `#footer`.

```vue
<script setup lang="ts">
import { UIMainSidebar } from '@wisemen/vue-core'
</script>

<template>
  <UIMainSidebar collapsed-variant="hidden">
    <template #header>
      <img src="/logo.svg" alt="Logo" class="h-8" />
    </template>

    <template #navigation>
      <!-- primary nav items -->
    </template>

    <template #bottom-navigation>
      <!-- secondary nav items -->
    </template>

    <template #footer>
      <!-- user profile / logout -->
    </template>
  </UIMainSidebar>
</template>
```

The sidebar automatically collapses into a mobile drawer at narrow viewports. Set `collapsed-variant="visible"` to keep a collapsed icon-only rail instead of hiding it entirely.

## API

<!-- @include: ./sidebar-meta.md -->
