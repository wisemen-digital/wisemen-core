<script setup lang="ts">
import { toComputedRefs } from '@/composables/context.composable'
import { useProvideConfigContext } from '@/ui/config-provider/config.context'
import type { ConfigProviderProps } from '@/ui/config-provider/config.types'
import TooltipProvider from '@/ui/tooltip/TooltipProvider.vue'

const props = defineProps<ConfigProviderProps>()

defineSlots<{
  /**
   * Wrap your application in this component to provide configuration to all components.
   */
  default: () => void
}>()

useProvideConfigContext(toComputedRefs(props))
</script>

<template>
  <TooltipProvider>
    <slot />
  </TooltipProvider>
</template>
