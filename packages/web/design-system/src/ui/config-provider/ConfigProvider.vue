<script setup lang="ts">
import { useReducedMotion } from 'motion-v'
import { watchEffect } from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useProvideConfigContext } from '@/ui/config-provider/config.context'
import type { ConfigProviderProps } from '@/ui/config-provider/config.types'

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  addressAutocompleteAdapter: null,
  autoCloseToast: 'always',
  googleMapsApiKey: null,
  hourCycle: null,
  numberFormat: 'system',
  projectName: 'wisemen',
  reducedMotion: false,
})

defineSlots<{
  /**
   * Wrap your application in this component to provide configuration to all components.
   */
  default: () => void
}>()

useProvideConfigContext(toComputedRefs(props))

const systemReducedMotion = useReducedMotion()

watchEffect(() => {
  document.documentElement.classList.toggle('ui-reduced-motion', props.reducedMotion || systemReducedMotion.value)
})
</script>

<template>
  <slot />
</template>
