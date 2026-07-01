<script setup lang="ts">
import { computed } from 'vue'

import type { MainLayoutVariant } from './mainLayout.context'
import { useProvideMainLayoutContext } from './mainLayout.context'
import MainLayoutCornerHighlight from './MainLayoutCornerHighlight.vue'

const props = withDefaults(defineProps<{
  variant?: MainLayoutVariant
}>(), {
  variant: 'default',
})

useProvideMainLayoutContext({
  variant: computed(() => props.variant),
})
</script>

<template>
  <div
    :class="props.variant === 'branded' ? `
      bg-linear-to-tr from-brand-950 to-brand-800
    ` : null"
    class="relative flex h-dvh w-full overflow-hidden"
  >
    <slot />

    <MainLayoutCornerHighlight v-if="props.variant !== 'branded'" />
  </div>
</template>
