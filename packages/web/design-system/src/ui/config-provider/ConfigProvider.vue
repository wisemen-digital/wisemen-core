<script setup lang="ts">
import { toComputedRefs } from '@/composables/context.composable'
import { useProvideAddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.context'
import { useProvideConfigContext } from '@/ui/config-provider/config.context'
import type { ConfigProviderProps } from '@/ui/config-provider/config.types'

const props = defineProps<ConfigProviderProps>()

defineSlots<{
  /**
   * Wrap your application in this component to provide configuration to all components.
   */
  default: () => void
}>()

useProvideConfigContext(toComputedRefs(props))

if (props.addressAutocompleteAdapter != null) {
  useProvideAddressAutocompleteAdapter(props.addressAutocompleteAdapter)
}
</script>

<template>
  <slot />
</template>
