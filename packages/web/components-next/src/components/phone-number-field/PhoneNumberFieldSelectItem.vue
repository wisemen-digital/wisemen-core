<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js'
import { getCountryCallingCode } from 'libphonenumber-js'
import { computed } from 'vue'

import { useInjectConfigContext } from '@/components/config-provider/config.context'
import {
  getCountryFlagUrl,
  getCountryName,
} from '@/components/phone-number-field/phoneNumber.util'
import SelectItem from '@/components/select/parts/SelectItem.vue'

const props = defineProps<{
  value: CountryCode
}>()

const globalConfigContext = useInjectConfigContext()

const countryFlagImageUrl = computed<string | null>(() => getCountryFlagUrl(props.value))
const countryName = computed<string | null>(
  () => getCountryName(props.value, globalConfigContext.locale.value),
)

const countryCallingCode = computed<string>(() => getCountryCallingCode(props.value))
</script>

<template>
  <SelectItem :value="props.value">
    <div class="flex items-center gap-md">
      <div class="h-3 w-5 overflow-hidden rounded-xxs">
        <img
          v-if="countryFlagImageUrl !== null"
          :src="countryFlagImageUrl"
          :alt="countryName ?? countryCallingCode"
          class="size-full object-cover"
        >
      </div>

      <span>
        {{ countryName ?? countryCallingCode }}
      </span>
    </div>
  </SelectItem>
</template>
