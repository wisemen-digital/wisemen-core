<script setup lang="ts">
import { computed } from 'vue'

import type { SkeletonItemProps } from '@/ui/skeleton-item/skeletonItem.props'

const props = withDefaults(defineProps<SkeletonItemProps>(), {
  isAnimated: false,
  animationDelayInMs: 0,
})

const isAnimated = computed<boolean>(() => props.isAnimated || props.animate === true)
</script>

<template>
  <div
    :aria-busy="true"
    class="relative overflow-hidden rounded-md bg-tertiary"
    role="status"
    aria-live="polite"
  >
    <div
      v-if="isAnimated"
      :style="{ animationDelay: `${props.animationDelayInMs}ms` }"
      class="custom-shimmer absolute inset-0"
    />
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.custom-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 1.5s infinite;
}
</style>
