<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/tabs/stories/TabsPlayground.vue'

</script>

# Tabs

Tabbed navigation for switching between sibling content sections.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-tabs--default)

## Usage

Compose `UITabs` with `UITabsList`, `UITabsItem` (one per tab), and `UITabsContent` (one per tab value). Bind the active tab with `v-model`.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Settings01Icon, User01Icon } from '@wisemen/vue-core-icons'
import { UITabs, UITabsContent, UITabsItem, UITabsList } from '@wisemen/vue-core'

const activeTab = ref('general')
</script>

<template>
  <UITabs v-model="activeTab" variant="underline">
    <UITabsList>
      <UITabsItem :icon="User01Icon" label="General" value="general" />
      <UITabsItem :icon="Settings01Icon" label="Settings" value="settings" />
    </UITabsList>

    <UITabsContent value="general">
      General content
    </UITabsContent>

    <UITabsContent value="settings">
      Settings content
    </UITabsContent>
  </UITabs>
</template>
```

### Router-based tabs

Use `UITabsRouterLink` instead of `UITabsItem` to drive active state from the current route rather than local state.

## API

<!-- @include: ./tabs-meta.md -->
