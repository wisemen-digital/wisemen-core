<script setup lang="ts">
import { Primitive } from 'reka-ui'
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <Primitive
    :as-child="true"
    class="
      animate-shimmer
      bg-[linear-gradient(110deg,var(--text-disabled)_40%,var(--text-primary)_50%,var(--text-disabled)_60%)]
      bg-size-[300%_100%] bg-clip-text! text-transparent
      dark:bg-[linear-gradient(110deg,var(--text-disabled)_40%,var(--text-primary)_50%,var(--text-disabled)_60%)]
    "
  >
    <slot />
  </Primitive>
</template>

<style>
@keyframes shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s linear infinite;
}
</style>
