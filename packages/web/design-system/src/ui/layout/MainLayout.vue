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

const isBranded = computed<boolean>(
  () => props.variant === 'branded',
)

useProvideMainLayoutContext({
  isBrandedActive: isBranded,
  variant: computed(
    () => props.variant,
  ),
})
</script>

<template>
  <div
    :class="isBranded ? `
      dark:bg-primary
      light:bg-linear-to-tr light:from-brand-950 light:to-brand-800
    ` : null"
    class="relative flex h-dvh w-full overflow-hidden"
  >
    <slot />

    <MainLayoutCornerHighlight :class="isBranded ? 'light:hidden' : null" />
  </div>
</template>
