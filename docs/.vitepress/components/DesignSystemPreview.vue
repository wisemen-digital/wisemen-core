<script setup lang="ts">
import { useData } from 'vitepress'
import {
  computed,
  watchEffect,
} from 'vue'
import { useI18n } from 'vue-i18n'

import type { HourCycle } from '@/types/hourCycle.type'
import type {
  Address,
  AddressAutocompleteAdapter,
  FormattedAddress,
} from '@/ui/address-autocomplete/addressAutocomplete.type'
import ConfigProvider from '@/ui/config-provider/ConfigProvider.vue'
import DialogContainer from '@/ui/dialog/DialogContainer.vue'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import ToastContainer from '@/ui/toast/ToastContainer.vue'
import TooltipProvider from '@/ui/tooltip/TooltipProvider.vue'

const props = withDefaults(defineProps<{
  hourCycle?: HourCycle
  locale?: string
  theme?: string
}>(), {
  hourCycle: '24-hour',
  locale: 'en-US',
  theme: undefined,
})

const {
  isDark,
} = useData()

const appearance = computed<'dark' | 'light'>(() => props.theme ?? (isDark.value ? 'dark' : 'light'))
const i18n = useI18n({
  useScope: 'global',
})

watchEffect(() => {
  i18n.locale.value = props.locale
})

const mockAddressAutocompleteAdapter: AddressAutocompleteAdapter = {
  async getAddressByPlaceId(placeId: string): Promise<Address> {
    await new Promise((resolve) => setTimeout(resolve, 100))

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
    await new Promise((resolve) => setTimeout(resolve, 100))

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
  <div class="mt-2xl relative">
    <ConfigProvider
      :locale="props.locale"
      :hour-cycle="props.hourCycle"
      :address-autocomplete-adapter="mockAddressAutocompleteAdapter"
      number-format="system"
      project-name="docs"
    >
      <ThemeProvider
        :appearance="appearance"
        class="vp-raw"
      >
        <TooltipProvider>
          <div
            class="
              vp-raw border-secondary bg-primary text-primary flex min-h-80
              items-center justify-center overflow-auto rounded-xl border
              border-solid p-12
            "
          >
            <slot />
          </div>
          <ToastContainer />
          <DialogContainer />
        </TooltipProvider>
      </ThemeProvider>
    </ConfigProvider>
  </div>
</template>
