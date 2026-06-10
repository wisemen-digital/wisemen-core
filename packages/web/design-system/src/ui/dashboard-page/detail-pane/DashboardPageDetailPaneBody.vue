<script setup lang="ts">
import { onBeforeUnmount } from 'vue'

import { useInjectDetailPaneScrollContext } from '@/ui/dashboard-page/detail-pane/detailPaneScroll.context'

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
  <div
    :ref="setBodyRef"
    class="flex-1 overflow-y-auto"
  >
    <slot />
  </div>
</template>
