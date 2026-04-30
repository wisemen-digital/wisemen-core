<script setup lang="ts">
import { ref } from 'vue'

import {
  UIAddressAutocomplete,
  UIAddressAutocompleteProvider,
} from '@/ui/address-autocomplete'
import type {
  Address,
  AddressAutocompleteAdapter,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isReadonly?: boolean
  isRequired?: boolean
  errorMessage?: string
  hideErrorMessage?: boolean
  hint?: string
  label?: string
  placeholder?: string
  size?: 'md' | 'sm'
}>(), {
  isDisabled: false,
  isReadonly: false,
  isRequired: false,
  errorMessage: undefined,
  hideErrorMessage: false,
  hint: undefined,
  label: 'Address',
  placeholder: 'Search an address...',
  size: 'md',
})

const mockAdapter: AddressAutocompleteAdapter = {
  async getAddressByPlaceId(placeId: string): Promise<Address> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const mockData: Record<string, Address> = {
      1: {
        placeId,
        bus: '',
        city: 'Brussels',
        coordinates: {
          lat: 50.85,
          lng: 4.35,
        },
        country: 'BE',
        postalCode: '1000',
        street: 'Mock Street',
        streetNumber: '1',
      },
      2: {
        placeId,
        bus: '',
        city: 'Ghent',
        coordinates: {
          lat: 51.05,
          lng: 3.72,
        },
        country: 'BE',
        postalCode: '9000',
        street: 'Mock Avenue',
        streetNumber: '42',
      },
      3: {
        placeId,
        bus: '',
        city: 'Antwerp',
        coordinates: {
          lat: 51.22,
          lng: 4.40,
        },
        country: 'BE',
        postalCode: '2000',
        street: 'Mock Lane',
        streetNumber: '7',
      },
    }

    return mockData[placeId] ?? mockData[1]!
  },

  async searchAddresses(): Promise<FormattedAddress[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [

      {
        placeId: '1',
        mainText: `Street 1`,
        secondaryText: '1000 Brussels',
      },
      {
        placeId: '2',
        mainText: `Avenue 42`,
        secondaryText: '9000 Ghent',
      },
      {
        placeId: '3',
        mainText: `Lane 7`,
        secondaryText: '2000 Antwerp',
      },
    ]
  },
}

const modelValue = ref<Address | null>(null)
</script>

<template>
  <div class="flex gap-2 p-xl">
    <UIAddressAutocompleteProvider :adapter="mockAdapter">
      <UIAddressAutocomplete
        v-model="modelValue"
        :error-message="props.errorMessage"
        :hide-error-message="props.hideErrorMessage"
        :hint="props.hint"
        :is-disabled="props.isDisabled"
        :is-readonly="props.isReadonly"
        :is-required="props.isRequired"
        :label="props.label"
        :placeholder="props.placeholder"
        :size="props.size"
        class="w-72"
      />
    </UIAddressAutocompleteProvider>
  </div>
</template>
