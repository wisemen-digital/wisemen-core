<script setup lang="ts">
import { computed } from 'vue'

import type { DetailPaneFooterProps } from '@/ui/dashboard-page/detail-pane/detailPaneFooter.props'
import { UISeparator } from '@/ui/separator'

const props = withDefaults(defineProps<DetailPaneFooterProps>(), {
  hasSeparator: true,
})

const hasSeparator = computed<boolean>(
  () => props.showSeparator !== undefined ? props.showSeparator : props.hasSeparator,
)
</script>

<template>
  <div class="sticky bottom-0 bg-primary">
    <UISeparator v-if="hasSeparator" />

    <div class="p-lg">
      <slot />
    </div>
  </div>
</template>
