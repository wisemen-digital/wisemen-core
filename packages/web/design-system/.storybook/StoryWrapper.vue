<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'

defineProps<{
  theme?: string
}>()
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <TooltipProvider>
    <div
      :class="[
        theme ?? 'light',
      ]"
      class="
        default flex items-center justify-center bg-primary p-4 text-primary
      "
    >
      <slot />
    </div>
  </TooltipProvider>
</template>
