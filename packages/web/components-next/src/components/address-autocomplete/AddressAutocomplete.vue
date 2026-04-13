<script setup lang="ts">
import { Loader } from '@googlemaps/js-api-loader'
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import type { AddressAutocompleteEmits } from '@/components/address-autocomplete/addressAutocomplete.emits'
import type { AddressAutocompleteProps } from '@/components/address-autocomplete/addressAutocomplete.props'
import type {
  Address,
  FormattedAddress,
} from '@/components/address-autocomplete/addressAutocomplete.type'
import {
  addressToFormattedAddress,
  formattedAddressToString,
  getAddressByPlaceId,
} from '@/components/address-autocomplete/addressAutocomplete.util'
import Autocomplete from '@/components/autocomplete/Autocomplete.vue'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import SelectItem from '@/components/select/parts/SelectItem.vue'

const props = defineProps<AddressAutocompleteProps>()

const emit = defineEmits<AddressAutocompleteEmits>()

const modelValue = defineModel<Address | null>({
  required: true,
})

const BUS_NUMBER_REGEX = /\/\s*(\d+)/

const {
  googleMapsApiKey,
} = useInjectConfigContext()

const isLoading = ref<boolean>(false)
const addressResults = ref<FormattedAddress[]>([])

let autocompleteService: typeof google.maps.places.AutocompleteSuggestion | null = null

const tempAddress = ref<FormattedAddress | null>(null)

const selectedAddress = computed<FormattedAddress | null>(() => {
  if (modelValue.value === null) {
    return null
  }

  return addressToFormattedAddress(modelValue.value)
})

const autocompleteItems = computed<FormattedAddress[]>(() => (
  addressResults.value.map((result) => {
    return {
      placeId: result.placeId,
      mainText: result.mainText,
      secondaryText: result.secondaryText,
    }
  })
))

async function onSearch(searchTerm: string): Promise<void> {
  if (autocompleteService === null) {
    throw new Error('Autocomplete service is not defined')
  }

  isLoading.value = true

  try {
    // Since google does not know the "street number/bus number" format,
    // we need explicitly add the word "bus" after the /
    // E.g. Street 23/11 => Street 23/bus 11
    let formattedAddress = searchTerm

    const match = searchTerm.match(BUS_NUMBER_REGEX)

    if (match !== null && match[1] !== undefined) {
      const busNumber = match[1]

      formattedAddress = formattedAddress.replace(BUS_NUMBER_REGEX, `/bus ${busNumber}`)
    }

    const results = await autocompleteService.fetchAutocompleteSuggestions({
      input: formattedAddress,
    })

    addressResults.value = results.suggestions
      .filter((suggestion) => suggestion.placePrediction !== null)
      .map((suggestion) => {
        const placePrediction = suggestion.placePrediction!

        return {
          placeId: placePrediction.placeId,
          mainText: placePrediction.mainText?.text ?? '',
          secondaryText: placePrediction.secondaryText?.text ?? '',
        }
      })
  }
  catch (error) {
    emit('error', error)
  }

  isLoading.value = false
}

async function onUpdateModelValue(value: FormattedAddress | null): Promise<void> {
  if (value === null) {
    modelValue.value = null

    return
  }

  tempAddress.value = value
  modelValue.value = await getAddressByPlaceId(value.placeId)
  tempAddress.value = null
}

async function createAutocompleteSuggestionService(
  apiKey: string,
): Promise<typeof google.maps.places.AutocompleteSuggestion> {
  const loader = new Loader({
    apiKey,
    libraries: [
      'places',
    ],
  })

  const {
    AutocompleteSuggestion,
  } = await loader.importLibrary('places')

  return AutocompleteSuggestion
}

onMounted(async () => {
  if (googleMapsApiKey === null) {
    throw new Error('Google Maps API key is not defined. Provide it in the config using the `<ConfigProvider />` component.')
  }

  autocompleteService = await createAutocompleteSuggestionService(googleMapsApiKey)
})
</script>

<template>
  <Autocomplete
    v-bind="props"
    :model-value="tempAddress || selectedAddress"
    :items="autocompleteItems"
    :is-loading="isLoading"
    :display-fn="(formattedAddress) => formattedAddressToString(formattedAddress)"
    @search="onSearch"
    @focus="emit('focus')"
    @blur="emit('blur')"
    @update:model-value="onUpdateModelValue"
  >
    <template #base>
      <slot name="base" />
    </template>

    <template #left>
      <slot name="left" />
    </template>

    <template #right>
      <slot name="right" />
    </template>

    <template #loader>
      <slot name="loader" />
    </template>

    <template #item="{ value }">
      <SelectItem :value="value">
        <div class="overflow-hidden">
          <p class="truncate font-medium">
            {{ value.mainText }}
          </p>

          <p class="line-clamp-2">
            {{ value.secondaryText }}
          </p>
        </div>
      </SelectItem>
    </template>
  </Autocomplete>
</template>
