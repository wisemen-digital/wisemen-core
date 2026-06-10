<script setup lang="ts">
import type { DetailPaneFooterProps } from '@/ui/dashboard-page/detail-pane/detailPaneFooter.props'
import { useInjectDetailPaneScrollContext } from '@/ui/dashboard-page/detail-pane/detailPaneScroll.context'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<DetailPaneFooterProps>(), {
  showSeparator: true,
})

const scrollContext = useInjectDetailPaneScrollContext(null)
</script>

<template>
  <div class="sticky bottom-0 bg-primary">
    <UISeparator
      v-if="props.showSeparator"
      :class="scrollContext !== null && scrollContext.isScrolledToBottom.value ? `
        opacity-0
      ` : `opacity-100`"
      class="transition-opacity duration-150"
    />

    <div class="p-lg">
      <slot />
    </div>
  </div>
</template>
