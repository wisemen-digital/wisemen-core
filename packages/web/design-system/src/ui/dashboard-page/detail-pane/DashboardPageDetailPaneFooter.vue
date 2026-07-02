<script setup lang="ts">
import type { DetailPaneFooterProps } from '@/ui/dashboard-page/detail-pane/detailPaneFooter.props'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<DetailPaneFooterProps>(), {
  hasSeparator: true,
})
</script>

<template>
  <div class="sticky bottom-0 bg-primary">
    <UISeparator v-if="props.hasSeparator" />

    <div class="p-lg">
      <slot />
    </div>
  </div>
</template>
