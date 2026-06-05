<script setup lang="ts">
import { computed } from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
import { useProvideConfigContext } from '@/ui/config-provider/config.context'
import type { ConfigProviderProps } from '@/ui/config-provider/config.types'

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  addressAutocompleteAdapter: null,
  dateLocale: null,
  googleMapsApiKey: null,
  reducedMotion: false,
  showNavigationArrowsInTopBar: false,
})

useIsReducedMotion(computed(() => props.reducedMotion))

useProvideConfigContext(toComputedRefs(props))
</script>

<template>
  <slot />
</template>
