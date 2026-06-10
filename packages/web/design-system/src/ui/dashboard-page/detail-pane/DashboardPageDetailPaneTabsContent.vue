<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

import { useInjectDetailPaneScrollContext } from '@/ui/dashboard-page/detail-pane/detailPaneScroll.context'
import { UITabsContent } from '@/ui/tabs'
import type { TabsContentProps } from '@/ui/tabs/tabs.props'

const props = defineProps<TabsContentProps>()

const {
  bodyRef,
} = useInjectDetailPaneScrollContext()

function setBodyRef(el: unknown): void {
  bodyRef.value = (el as HTMLElement | null) ?? null
}

onBeforeUnmount(() => {
  bodyRef.value = null
})
</script>

<template>
  <UITabsContent
    :value="props.value"
    :tabindex="-1"
    class="flex flex-1 flex-col overflow-hidden"
  >
    <div
      :ref="setBodyRef"
      tabindex="0"
      class="flex-1 overflow-y-auto outline-none"
    >
      <slot />
    </div>
  </UITabsContent>
</template>
