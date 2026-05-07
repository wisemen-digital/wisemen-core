<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import { useInjectAddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.context'
import type { AddressAutocompleteProps } from '@/ui/address-autocomplete/addressAutocomplete.props'
import type {
  Address,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'
import {
  addressToFormattedAddress,
  formattedAddressToString,
} from '@/ui/address-autocomplete/addressAutocomplete.util'
import { UIAutocomplete } from '@/ui/autocomplete'
import { createAutocompleteOptions } from '@/ui/autocomplete/autocomplete.type'

const props = defineProps<Omit<AddressAutocompleteProps, 'displayFn' | 'getItemConfig' | 'isLoading' | 'items' | 'searchMode'>>()

const emit = defineEmits<{
  blur: []
  error: [error: unknown]
}>()

const modelValue = defineModel<Address | null>({
  required: true,
})

const maybeAdapter = useInjectAddressAutocompleteAdapter(null)

if (maybeAdapter === null) {
  throw new Error(
    '[AddressAutocomplete] No adapter provided. Add an adapter to the ConfigProvider.\n'
    + 'Example: <ConfigProvider :address-autocomplete-adapter="myAdapter"><AddressAutocomplete ... /></ConfigProvider>',
  )
}

const adapter = maybeAdapter

const isLoading = ref<boolean>(false)
const addressResults = ref<FormattedAddress[]>([])
const tempAddress = ref<FormattedAddress | null>(null)

const selectedAddress = computed<FormattedAddress | null>(() => {
  if (modelValue.value === null) {
    return null
  }

  return addressToFormattedAddress(modelValue.value)
})

const displayModelValue = computed<FormattedAddress | null>(() => tempAddress.value ?? selectedAddress.value)

const autocompleteItems = computed(() => createAutocompleteOptions(addressResults.value))

async function onSearch(searchTerm: string): Promise<void> {
  isLoading.value = true

  try {
    addressResults.value = await adapter.searchAddresses(searchTerm)
  }
  catch (error) {
    emit('error', error)
  }
  finally {
    isLoading.value = false
  }
}

async function onUpdateModelValue(value: FormattedAddress | null): Promise<void> {
  if (value === null) {
    modelValue.value = null

    return
  }

  try {
    tempAddress.value = value
    modelValue.value = await adapter.getAddressByPlaceId(value.placeId)
  }
  catch (error) {
    emit('error', error)
  }
  finally {
    tempAddress.value = null
  }
}
</script>

<template>
  <UIAutocomplete
    v-bind="props"
    :model-value="displayModelValue"
    :items="autocompleteItems"
    :is-loading="isLoading"
    :display-fn="(fa: FormattedAddress) => formattedAddressToString(fa)"
    search-mode="remote"
    @blur="emit('blur')"
    @update:search="onSearch"
    @update:model-value="onUpdateModelValue"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <template #left>
      <slot name="left" />
    </template>
  </UIAutocomplete>
</template>
