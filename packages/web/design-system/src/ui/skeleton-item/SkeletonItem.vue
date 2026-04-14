<script setup lang="ts">
import type { SkeletonItemProps } from '@/ui/skeleton-item/skeletonItem.props'

const props = withDefaults(defineProps<SkeletonItemProps>(), {
  animate: false,
  animationDelayInMs: 0,
})
</script>

<!-- eslint-disable better-tailwindcss/no-unknown-classes -->
<template>
  <div
    :aria-busy="true"
    class="
      relative overflow-hidden rounded-md bg-tertiary
      dark:bg-secondary
    "
    role="status"
    aria-live="polite"
  >
    <div
      v-if="props.animate"
      :style="{ animationDelay: `${props.animationDelayInMs}ms` }"
      class="shimmer absolute inset-0"
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

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 1.5s infinite;
}
</style>
