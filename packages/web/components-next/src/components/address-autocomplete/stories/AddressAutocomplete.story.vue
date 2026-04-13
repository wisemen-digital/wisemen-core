<script setup lang="ts">
import { ref } from 'vue'

import type { Address } from '@/components/address-autocomplete/addressAutocomplete.type'
import AddressAutocomplete from '@/components/address-autocomplete/AddressAutocomplete.vue'

const value = ref<Address | null>({
  bus: '',
  city: 'Amsterdam',
  coordinates: {
    lat: 52.370_216_0,
    lng: 4.895_168_0,
  },
  country: 'Netherlands',
  postalCode: '1012',
  street: 'Keizersgracht',
  streetNumber: '1',
})
</script>

<template>
  <Story title="AddressAutocomplete">
    <div>
      <AddressAutocomplete
        v-model="value"
        class="w-72"
      />
    </div>
  </Story>
</template>
