<script setup lang="ts">
import type { HourCycle } from '@/types/hourCycle.type'
import type {
  Address,
  AddressAutocompleteAdapter,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'
import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

defineProps<{
  hourCycle?: HourCycle
  locale?: string
  theme?: string
}>()

const mockAddressAutocompleteAdapter: AddressAutocompleteAdapter = {
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
        mainText: 'Street 1',
        secondaryText: '1000 Brussels',
      },
      {
        placeId: '2',
        mainText: 'Avenue 42',
        secondaryText: '9000 Ghent',
      },
      {
        placeId: '3',
        mainText: 'Lane 7',
        secondaryText: '2000 Antwerp',
      },
    ]
  },
}
</script>

<template>
  <!-- eslint-disable better-tailwindcss/no-unknown-classes -->
  <ConfigProvider
    :locale="locale ?? 'en-US'"
    :hour-cycle="hourCycle ?? '24-hour'"
    :address-autocomplete-adapter="mockAddressAutocompleteAdapter"
    project-name="story-book"
  >
    <ThemeProvider
      :appearance="theme ?? 'light'"
    >
      <div
        class="
          default flex items-center justify-center bg-primary p-4 text-primary
        "
      >
        <slot />
      </div>
    </ThemeProvider>
  </ConfigProvider>
</template>
