<script setup lang="ts">
import { useProvideAddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.context'
import type { AddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.type'

const props = defineProps<{
  adapter: AddressAutocompleteAdapter
}>()

useProvideAddressAutocompleteAdapter(props.adapter)
</script>

<template>
  <slot />
</template>
