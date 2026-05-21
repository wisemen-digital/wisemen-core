<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'
import {
  computed,
  ref,
} from 'vue'

import type { AddressAutocompleteProps } from '@/ui/address-autocomplete/addressAutocomplete.props'
import type {
  Address,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'
import {
  addressToFormattedAddress,
  formattedAddressToString,
} from '@/ui/address-autocomplete/addressAutocomplete.util'
import AddressAutocompleteSelectedCard from '@/ui/address-autocomplete/AddressAutocompleteSelectedCard.vue'
import { UIAutocomplete } from '@/ui/autocomplete'
import { createAutocompleteOptions } from '@/ui/autocomplete/autocomplete.type'
import { useInjectConfigContext } from '@/ui/config-provider'

const props = defineProps<Omit<AddressAutocompleteProps, 'displayFn' | 'getItemConfig' | 'isLoading' | 'items' | 'searchMode'>>()

const emit = defineEmits<{
  blur: []
  error: [error: unknown]
}>()

const modelValue = defineModel<Address | null>({
  required: true,
})

const {
  addressAutocompleteAdapter: maybeAdapter,
} = useInjectConfigContext()

if (maybeAdapter.value === null) {
  throw new Error(
    '[AddressAutocomplete] No adapter provided. Add an adapter to the ConfigProvider.\n'
    + 'Example: <ConfigProvider :address-autocomplete-adapter="myAdapter"><AddressAutocomplete ... /></ConfigProvider>',
  )
}

const adapter = maybeAdapter.value

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

const addressForCard = computed<Address | null>(() => {
  if (modelValue.value !== null) {
    return modelValue.value
  }

  if (tempAddress.value !== null) {
    return {
      placeId: tempAddress.value.placeId,
      bus: '',
      city: '',
      coordinates: {
        lat: null,
        lng: null,
      },
      country: '',
      postalCode: tempAddress.value.secondaryText,
      street: tempAddress.value.mainText,
      streetNumber: '',
    }
  }

  return null
})

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
  <AnimatePresence mode="wait">
    <Motion
      :key="addressForCard !== null ? 'card' : 'autocomplete'"
      :class="props.class"
      :initial="{
        filter: 'blur(4px)',
        opacity: 0,
      }"
      :animate="{
        filter: 'blur(0px)',
        opacity: 1,
      }"
      :exit="{
        filter: 'blur(4px)',
        opacity: 0,
      }"
      :transition="{
        duration: 0.2,
      }"
    >
      <AddressAutocompleteSelectedCard
        v-if="addressForCard !== null"
        :address="addressForCard"
        :is-disabled="props.isDisabled"
        :is-loading="tempAddress !== null"
        :is-readonly="props.isReadonly"
        @update:model-value="modelValue = $event"
        @clear="modelValue = null"
        @error="emit('error', $event)"
      />

      <UIAutocomplete
        v-else
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
    </Motion>
  </AnimatePresence>
</template>
