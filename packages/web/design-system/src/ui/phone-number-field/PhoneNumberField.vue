<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
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
} from '@/types/input.type'
import { useInjectConfigContext } from '@/ui/config-provider/config.context'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import {
  getCountryFlagSvg,
  getCountryName,
} from '@/ui/phone-number-field/phoneNumber.util'
import type { PhoneNumberFieldProps } from '@/ui/phone-number-field/phoneNumberField.props'
import type { PhoneNumberFieldStyle } from '@/ui/phone-number-field/phoneNumberField.style'
import { createPhoneNumberFieldStyle } from '@/ui/phone-number-field/phoneNumberField.style'
import { UISelectDropdown } from '@/ui/select'
import type { SelectItem } from '@/ui/select/select.type'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PhoneNumberFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  defaultCountryCode: 'BE',
  placeholder: '000 00 00 00',
  preferredCountryCodes: () => [],
  size: 'md',
})

const modelValue = defineModel<string | null>({
  required: true,
})

const configContext = useInjectConfigContext(null)
const attrs = useAttrs()
const id = props.id ?? useId()
const inputRef = useTemplateRef('input')
const fieldWrapperRef = useTemplateRef<{ $el: HTMLElement } | null>('fieldWrapper')

const fieldWrapperEl = computed<HTMLElement | null>(() => fieldWrapperRef.value?.$el ?? null)

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

const style = computed<PhoneNumberFieldStyle>(() => createPhoneNumberFieldStyle({
  size: props.size,
}))

const locale = computed<string>(() => configContext?.locale.value ?? navigator.language)

const countryCode = ref<CountryCode>(getDefaultCountryCode())
const countrySearch = ref<string>('')

const flagSvg = computed<string | null>(() => getCountryFlagSvg(countryCode.value))

const dialCodeDisplayValue = computed<string>(() => `+${getCountryCallingCode(countryCode.value)}`)

const selectedCountryName = computed<string>(
  () => getCountryName(countryCode.value, locale.value) ?? countryCode.value,
)

const asYouType = computed<AsYouType>(() => new AsYouType(countryCode.value))

const inputValue = computed<string | null>({
  get: () => {
    if (modelValue.value === null) {
      return null
    }

    const dialCode = getCountryCallingCode(countryCode.value).toString()
    const formatted = formatIncompletePhoneNumber(modelValue.value, countryCode.value)

    return formatted.replace(`+${dialCode}`, '').trim()
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

const countryItems = computed<SelectItem<CountryCode>[]>(() => {
  const preferred = props.preferredCountryCodes ?? []
  const all = getCountries()
  const search = countrySearch.value.trim()

  const filtered = search === ''
    ? all
    : all.filter((cc) => matchesCountrySearch(cc, search))

  if (preferred.length === 0 || search !== '') {
    return filtered.map((cc) => ({
      type: 'option',
      value: cc,
    }))
  }

  const preferredFiltered = preferred.filter((cc) => filtered.includes(cc))
  const restFiltered = filtered.filter((cc) => !(preferred as string[]).includes(cc))

  return [
    ...preferredFiltered.map((cc) => ({
      type: 'option' as const,
      value: cc,
    })),
    ...(preferredFiltered.length > 0 && restFiltered.length > 0
      ? [
          {
            type: 'separator' as const,
          },
        ]
      : []),
    ...restFiltered.map((cc) => ({
      type: 'option' as const,
      value: cc,
    })),
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

  return cc.toLowerCase().includes(term) || name.toLowerCase().includes(term)
}

function getCountryItemConfig(cc: CountryCode): MenuItemConfig {
  return {
    descriptionLayout: 'inline',
    flag: {
      ariaLabel: getCountryName(cc, locale.value) ?? cc,
      svg: getCountryFlagSvg(cc) ?? '',
    },
    label: getCountryName(cc, locale.value),
    right: {
      text: `+${getCountryCallingCode(cc)}`,
      type: 'text',
    },
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
              <span
                v-if="flagSvg !== null"
                :class="style.countryFlag()"
                role="img"
                aria-hidden="true"
                v-html="flagSvg"
              />

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
        :placeholder="props.placeholder ?? undefined"
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
