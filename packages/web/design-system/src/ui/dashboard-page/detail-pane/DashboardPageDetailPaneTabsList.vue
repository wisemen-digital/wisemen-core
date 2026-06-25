<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
} from 'vue'

import { useInjectDetailPaneScrollContext } from '@/ui/dashboard-page/detail-pane/detailPaneScroll.context'
import { UITabsList } from '@/ui/tabs'

const {
  hasTabs,
} = useInjectDetailPaneScrollContext()

onMounted(() => {
  hasTabs.value = true
})

onBeforeUnmount(() => {
  hasTabs.value = false
})
</script>

<template>
  <div class="sticky top-0 z-10 bg-primary">
    <UITabsList>
      <slot />
    </UITabsList>
  </div>
</template>
