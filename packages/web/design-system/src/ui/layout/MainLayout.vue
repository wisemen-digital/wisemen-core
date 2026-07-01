<script setup lang="ts">
import { computed } from 'vue'

import { useInjectThemeProviderContext } from '@/ui/theme-provider/themeProvider.context'

import type { MainLayoutVariant } from './mainLayout.context'
import { useProvideMainLayoutContext } from './mainLayout.context'
import MainLayoutCornerHighlight from './MainLayoutCornerHighlight.vue'

const props = withDefaults(defineProps<{
  variant?: MainLayoutVariant
}>(), {
  variant: 'default',
})

const {
  appearance,
} = useInjectThemeProviderContext()

const isBrandedActive = computed<boolean>(
  () => props.variant === 'branded' && appearance.value !== 'dark',
)

useProvideMainLayoutContext({
  isBrandedActive,
  variant: computed(
    () => props.variant,
  ),
})
</script>

<template>
  <div
    :class="isBrandedActive ? 'bg-linear-to-tr from-brand-950 to-brand-800' : null"
    class="relative flex h-dvh w-full overflow-hidden"
  >
    <slot />

    <MainLayoutCornerHighlight v-if="!isBrandedActive" />
  </div>
</template>
