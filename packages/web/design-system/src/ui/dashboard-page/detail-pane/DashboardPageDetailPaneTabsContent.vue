<script setup lang="ts">
import { UIScrollable } from '@/ui/scrollable'
import { UITabsContent } from '@/ui/tabs'
import type { TabsContentProps } from '@/ui/tabs/tabs.props'

const props = withDefaults(defineProps<TabsContentProps>(), {
  asChild: true,
})
</script>

<template>
  <UITabsContent
    :as-child="props.asChild"
    :value="props.value"
    :tabindex="props.asChild ? undefined : -1"
  >
    <UIScrollable
      tabindex="0"
      class="flex flex-1 flex-col"
    >
      <slot />
    </UIScrollable>
  </UITabsContent>
</template>
