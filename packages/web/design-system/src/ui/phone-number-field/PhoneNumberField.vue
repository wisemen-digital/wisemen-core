<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import type { CountryCode } from 'libphonenumber-js'
import {
  AsYouType,
  formatIncompletePhoneNumber,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { useFilter } from 'reka-ui'
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  useId,
  useTemplateRef,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
  omit,
} from '@/types/input.type'
import { useInjectConfigContext } from '@/ui/config-provider/config.context'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import {
  getCountryFlagSvgUrl,
  getCountryName,
} from '@/ui/phone-number-field/phoneNumber.util'
import type { PhoneNumberFieldProps } from '@/ui/phone-number-field/phoneNumberField.props'
import type { PhoneNumberFieldStyle } from '@/ui/phone-number-field/phoneNumberField.style'
import { createPhoneNumberFieldStyle } from '@/ui/phone-number-field/phoneNumberField.style'
import { UISelectDropdown } from '@/ui/select'
import type {
  SelectItem,
  SelectOptionItem,
} from '@/ui/select/select.type'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PhoneNumberFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...omit(INPUT_FIELD_DEFAULTS, 'placeholder'),
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  defaultCountryCode: 'BE',
  preferredCountryCodes: () => [],
  size: 'md',
})

const DIGIT_REGEX = /\d/g

const modelValue = defineModel<string | null>({
  required: true,
})

const configContext = useInjectConfigContext(null)
const attrs = useAttrs()
const id = props.id ?? useId()
const inputRef = useTemplateRef('input')
const fieldWrapperRef = useTemplateRef('fieldWrapper')

const fieldWrapperEl = computed<HTMLElement | null>(() => fieldWrapperRef.value?.$el ?? null)

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const {
  contains,
} = useFilter()

const style = computed<PhoneNumberFieldStyle>(() => createPhoneNumberFieldStyle({
  size: props.size,
}))

const locale = computed<string>(() => configContext?.locale.value ?? navigator.language)

const countryCode = ref<CountryCode>(getDefaultCountryCode())
const countrySearch = ref<string>('')

const flagSvgUrl = computed<string | null>(() => getCountryFlagSvgUrl(countryCode.value))

const dialCodeDisplayValue = computed<string>(() => `+${getCountryCallingCode(countryCode.value)}`)

const selectedCountryName = computed<string>(
  () => getCountryName(countryCode.value, locale.value) ?? countryCode.value,
)

const asYouType = computed<AsYouType>(() => new AsYouType(countryCode.value))

function formatNationalInput(value: string): string {
  const dialCode = getCountryCallingCode(countryCode.value).toString()
  const formatted = formatIncompletePhoneNumber(value, countryCode.value)

  return formatted.replace(`+${dialCode}`, '').trim()
}

const placeholder = computed<string>(() => {
  const example = getExampleNumber(countryCode.value, examples)

  if (example === undefined) {
    return '000 00 00 00'
  }

  return formatNationalInput(example.number).replace(DIGIT_REGEX, '0')
})

const inputValue = computed<string | null>({
  get: () => {
    if (modelValue.value === null) {
      return null
    }

    return formatNationalInput(modelValue.value)
  },
  set: (value) => {
    if (value === null || value === '') {
      modelValue.value = null

      return
    }

    const validation = validatePhoneNumberLength(value, countryCode.value)

    if (validation === 'TOO_LONG') {
      const prev = structuredClone(modelValue.value)

      modelValue.value = ''

      void nextTick(() => {
        modelValue.value = prev
      })

      return
    }

    const fullNumber = `+${getCountryCallingCode(countryCode.value)} ${value}`

    asYouType.value.reset()
    asYouType.value.input(fullNumber)

    if (asYouType.value.isValid()) {
      modelValue.value = asYouType.value.getNumber()?.formatInternational() ?? fullNumber

      return
    }

    modelValue.value = fullNumber
  },
})

function countryCodeToOption(cc: CountryCode): SelectOptionItem<CountryCode> {
  return {
    type: 'option' as const,
    value: cc,
  }
}

const countryItems = computed<SelectItem<CountryCode>[]>(() => {
  const preferred = props.preferredCountryCodes ?? []
  const search = countrySearch.value.trim()
  const all = getCountries()

  const filtered = search
    ? all.filter((cc) => matchesCountrySearch(cc, search))
    : all

  const separator = {
    type: 'separator' as const,
  }

  if (preferred.length === 0 || search) {
    return filtered.map(countryCodeToOption)
  }

  const preferredItems = preferred.filter((cc) => filtered.includes(cc))
  const restItems = filtered.filter((cc) => !preferred.includes(cc as CountryCode))
  const hasBothGroups = preferredItems.length > 0 && restItems.length > 0

  return [
    ...preferredItems.map(countryCodeToOption),
    ...(hasBothGroups
      ? [
          separator,
        ]
      : []),
    ...restItems.map(countryCodeToOption),
  ]
})

function getDefaultCountryCode(): CountryCode {
  if (modelValue.value === null) {
    return props.defaultCountryCode ?? 'BE'
  }

  const parsed = parsePhoneNumberFromString(modelValue.value) ?? null

  if (parsed === null || parsed.country === undefined) {
    return props.defaultCountryCode ?? 'BE'
  }

  return parsed.country
}

function matchesCountrySearch(cc: CountryCode, search: string): boolean {
  const name = getCountryName(cc, locale.value) ?? ''
  const term = search.toLowerCase()
  const countryCallingCode = getCountryCallingCode(cc)

  return contains(countryCallingCode.toLowerCase(), term.toLowerCase())
    || contains(cc.toLowerCase(), term.toLowerCase())
    || contains(name.toLowerCase(), term.toLowerCase())
}

function getCountryItemConfig(cc: CountryCode): MenuItemConfig {
  const flagUrl = getCountryFlagSvgUrl(cc)

  return {
    description: `+${getCountryCallingCode(cc)}`,
    descriptionLayout: 'inline',
    image: flagUrl === null
      ? null
      : {
          aspect: 'rectangle',
          src: flagUrl,
        },
    label: getCountryName(cc, locale.value),
  }
}

function onCountryChange(value: CountryCode): void {
  if (modelValue.value === null) {
    countryCode.value = value

    return
  }

  const tempModel = modelValue.value.replace(
    `+${getCountryCallingCode(countryCode.value)}`,
    `+${getCountryCallingCode(value)}`,
  )

  modelValue.value = formatIncompletePhoneNumber(tempModel, value)
  countryCode.value = value
}

function onCountrySearch(search: string): void {
  countrySearch.value = search
}

function onInput(event: Event): void {
  inputValue.value = (event.target as HTMLInputElement).value || null
}

defineExpose({
  input: inputRef,
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :label="props.label"
    :class="props.class"
    :style="props.style"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <FieldWrapper
      ref="fieldWrapper"
      :icon-left="props.iconLeft"
      :icon-right="props.iconRight"
      :is-loading="props.isLoading"
      :is-error="isError"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :size="props.size"
    >
      <template #left>
        <UISelectDropdown
          :model-value="countryCode"
          :items="countryItems"
          :display-fn="(cc: CountryCode) => getCountryName(cc, locale) ?? cc"
          :get-item-config="getCountryItemConfig"
          :is-disabled="props.isDisabled"
          :popover-anchor-reference-element="fieldWrapperEl"
          :has-virtual-scroll="true"
          search="remote"
          popover-align="start"
          popover-width="anchor-width"
          @update:model-value="onCountryChange"
          @update:search="onCountrySearch"
        >
          <template #trigger="{ isOpen }">
            <button
              :class="style.countryTrigger({ size: props.size })"
              :disabled="props.isDisabled"
              :aria-expanded="isOpen"
              :aria-label="selectedCountryName"
              type="button"
            >
              <img
                v-if="flagSvgUrl !== null"
                :src="flagSvgUrl"
                :class="style.countryFlag()"
                alt=""
              >

              <ChevronDownIcon class="size-3 shrink-0 text-tertiary" />
            </button>
          </template>
        </UISelectDropdown>

        <span :class="style.dialCode()">{{ dialCodeDisplayValue }}</span>
      </template>

      <input
        v-bind="attrs"
        :id="id"
        ref="input"
        :value="inputValue"
        :disabled="props.isDisabled"
        :readonly="props.isReadonly"
        :aria-describedby="ariaDescribedBy"
        :aria-busy="ariaBusy"
        :aria-invalid="ariaInvalid"
        :aria-required="ariaRequired"
        :placeholder="placeholder"
        :name="props.name ?? undefined"
        :class="style.input({ size: props.size })"
        type="tel"
        autocomplete="tel"
        data-field-wrapper
        @input="onInput"
      >
    </FieldWrapper>
  </InputWrapper>
</template>
