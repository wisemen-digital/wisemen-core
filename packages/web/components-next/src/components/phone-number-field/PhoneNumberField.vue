<script setup lang="ts">
import type { CountryCode } from 'libphonenumber-js'
import {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js'
import {
  computed,
  nextTick,
  ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClassConfigs,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useInjectConfigContext } from '@/components/config-provider/config.context'
import {
  getCountryFlagUrl,
  getCountryName,
} from '@/components/phone-number-field/phoneNumber.util'
import type { PhoneNumberFieldProps } from '@/components/phone-number-field/phoneNumberField.props'
import type { CreatePhoneNumberFieldStyle } from '@/components/phone-number-field/phoneNumberField.style'
import { createPhoneNumberFieldStyle } from '@/components/phone-number-field/phoneNumberField.style'
import PhoneNumberFieldSelectItem from '@/components/phone-number-field/PhoneNumberFieldSelectItem.vue'
import SelectBaseSingle from '@/components/select/parts/SelectBaseSingle.vue'
import Select from '@/components/select/Select.vue'
import TextField from '@/components/text-field/TextField.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'

const props = withDefaults(defineProps<PhoneNumberFieldProps>(), {
  classConfig: null,
  defaultCountryCode: 'BE',
  variant: null,
})

const model = defineModel<string | null>({
  required: true,
})

const globalConfigContext = useInjectConfigContext()
const {
  theme,
} = injectThemeProviderContext()

const phoneNumberFieldRef = ref<InstanceType<any> | null>(null)
const phoneNumberFieldEl = computed<HTMLElement | null>(() => phoneNumberFieldRef.value?.$el ?? null)

const countryCode = ref<CountryCode>(getDefaultCountryCode())
const countries = getCountries()

const countryCodeModel = computed<CountryCode>({
  get: () => {
    return countryCode.value
  },
  set: (value) => {
    if (model.value === null) {
      countryCode.value = value as CountryCode

      return
    }

    const newModel = model.value?.replace(`+${getCountryCallingCode(countryCode.value)}`, `+${getCountryCallingCode(value)}`) ?? null

    if (newModel !== null) {
      model.value = formatIncompletePhoneNumber(newModel, value as CountryCode)
    }

    countryCode.value = value as CountryCode
  },
})

const asYouType = computed<AsYouType>(() => new AsYouType(countryCode.value))

const inputModel = computed<string | null>({
  get: () => {
    if (model.value === null) {
      return null
    }

    const dialCode = getCountryCallingCode(countryCodeModel.value).toString()

    const formattedNumber = formatIncompletePhoneNumber(model.value, countryCodeModel.value)

    return formattedNumber.replace(`+${dialCode}`, '').trim()
  },
  set: (value) => {
    if (value === null || value === '') {
      model.value = null

      return
    }

    const phoneNumberValidation = validatePhoneNumberLength(value, countryCode.value)

    if (phoneNumberValidation === 'TOO_LONG') {
      const tempModelValue = structuredClone(model.value)

      model.value = ''

      void nextTick(() => {
        model.value = tempModelValue
      })

      return
    }

    const fullNumber = `+${getCountryCallingCode(countryCodeModel.value)} ${value}`

    asYouType.value.reset()
    asYouType.value.input(fullNumber)

    if (asYouType.value.isValid()) {
      model.value = asYouType.value.getNumber()?.formatInternational() ?? fullNumber
    }

    model.value = fullNumber
  },
})

const phoneNumberFieldStyle = computed<CreatePhoneNumberFieldStyle>(
  () => createPhoneNumberFieldStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'phoneNumberField'>>(
  () => getCustomComponentVariant('phoneNumberField', theme.value, {
    variant: props.variant,
  }),
)

const dialCodeDisplayValue = computed<string>(() => `+${getCountryCallingCode(countryCodeModel.value)}`)

function getDefaultCountryCode(): CountryCode {
  if (model.value === null) {
    return props.defaultCountryCode
  }

  const parsedPhoneNumber = parsePhoneNumberFromString(model.value) ?? null

  if (parsedPhoneNumber === null || parsedPhoneNumber.country === undefined) {
    console.warn(`Invalid phone number format: ${model.value}. Defaulting to ${props.defaultCountryCode}.`)

    return props.defaultCountryCode
  }

  return parsedPhoneNumber.country ?? props.defaultCountryCode
}

function filterFn(option: CountryCode, searchTerm: string): boolean {
  const optionName = getCountryName(option, globalConfigContext.locale.value) ?? ''

  return option.toLowerCase().includes(searchTerm.toLowerCase())
    || optionName.toLowerCase().includes(searchTerm.toLowerCase())
}
</script>

<template>
  <TextField
    ref="phoneNumberFieldRef"
    v-bind="props"
    v-model="inputModel"
    :class-config="mergeClassConfigs(
      {
        input: 'pl-sm',
      },
      customClassConfig?.input,
      props.classConfig?.input,
    )"
    type="tel"
  >
    <template #label>
      <slot name="label" />
    </template>

    <template #error>
      <slot name="error" />
    </template>

    <template #hint>
      <slot name="hint" />
    </template>

    <template #left>
      <Select
        v-model="countryCodeModel"
        :popover-anchor-reference-element="phoneNumberFieldEl"
        :display-fn="(countryCode) => countryCode"
        :filter="{
          isEnabled: true,
          fn: filterFn,
        }"
        :virtual-list="{
          isEnabled: true,
          items: countries,
        }"
        :class-config="mergeClassConfigs(
          {
            root: 'h-8 ml-[0.18rem] rounded-xs border-none shadow-none outline-none not-disabled:hover:bg-primary-hover pr-xs focus-within:bg-tertiary',
            iconRight: 'mr-0 size-4',
            baseSingle: 'pr-0',
          },
          customClassConfig.select,
          props.classConfig?.select,
        )"
        :is-disabled="props.isDisabled"
        class="shrink-0"
        popover-align="start"
      >
        <template #base>
          <SelectBaseSingle>
            <img
              v-if="countryCodeModel !== null"
              :src="getCountryFlagUrl(countryCodeModel) ?? undefined"
              :alt="getCountryName(countryCodeModel, globalConfigContext.locale.value) ?? countryCodeModel"
              :class="phoneNumberFieldStyle.countryFlag({
                class: mergeClasses(customClassConfig.countryFlag, props.classConfig?.countryFlag),
              })"
            >

            <span class="sr-only">
              {{ getCountryName(countryCodeModel, globalConfigContext.locale.value) ?? countryCodeModel }}
            </span>
          </SelectBaseSingle>
        </template>

        <template #virtual-list-item="{ item }">
          <PhoneNumberFieldSelectItem :value="item" />
        </template>
      </Select>

      <span
        :class="phoneNumberFieldStyle.dialCode({
          class: mergeClasses(customClassConfig.dialCode, props.classConfig?.dialCode),
        })"
      >
        {{ dialCodeDisplayValue }}
      </span>
    </template>
  </TextField>
</template>
