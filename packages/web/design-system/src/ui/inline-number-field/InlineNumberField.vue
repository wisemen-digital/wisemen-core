<script setup lang="ts">
import {
  NumberFieldInput as RekaNumberFieldInput,
  NumberFieldRoot as RekaNumberFieldRoot,
} from 'reka-ui'
import {
  computed,
  ref,
  useAttrs,
  useId,
  watch,
} from 'vue'

import { useInlineInput } from '@/composables/input.composable'
import {
  formatNumberDecimalSeparators,
  useNumberFieldLocale,
} from '@/composables/numberField.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INLINE_FIELD_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
} from '@/types/input.type'
import InlineFieldWrapper from '@/ui/inline-field-wrapper/InlineFieldWrapper.vue'
import type { InlineNumberFieldProps } from '@/ui/inline-number-field/inlineNumberField.props'
import type { InlineNumberFieldStyle } from '@/ui/inline-number-field/inlineNumberField.style'
import { createInlineNumberFieldStyle } from '@/ui/inline-number-field/inlineNumberField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InlineNumberFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  ...INLINE_FIELD_DEFAULTS,
  formatOptions: null,
  max: null,
  min: null,
  size: 'md',
  step: 1,
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<number | null>({
  required: true,
})

const inlineNumberFieldStyle = computed<InlineNumberFieldStyle>(() => createInlineNumberFieldStyle({
  size: props.size,
}))

// Since reka-ui's NumberField only updates modelValue on blur/enter, keep a copied value for immediate UI updates.
const copiedModelValue = ref<number | null>(modelValue.value)
const isEditing = ref<boolean>(false)

watch(
  () => modelValue.value,
  (value) => {
    if (isEditing.value) {
      return
    }

    copiedModelValue.value = value
  },
)

const attrs = useAttrs()
const id = props.id ?? useId()

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInlineInput(id, props)

const {
  effectiveLocale,
} = useNumberFieldLocale()

function onInput(event: InputEvent): void {
  isEditing.value = true

  const target = event.target as HTMLInputElement
  const value = target.value

  if (value === '') {
    modelValue.value = null

    return
  }

  const valueAsNumber = formatNumberDecimalSeparators(value, effectiveLocale.value)

  if (Number.isNaN(valueAsNumber)) {
    return
  }

  modelValue.value = valueAsNumber
}

function onEnterKeyDown(): void {
  copiedModelValue.value = modelValue.value
  isEditing.value = false
}

function onBlur(event: FocusEvent): void {
  copiedModelValue.value = modelValue.value
  isEditing.value = false
  emit('blur', event)
}

watch(copiedModelValue, () => {
  modelValue.value = copiedModelValue.value ?? null
})
</script>

<template>
  <RekaNumberFieldRoot
    v-bind="attrs"
    :id="id"
    v-model="copiedModelValue"
    :readonly="props.isReadonly"
    :required="props.isRequired"
    :disable-wheel-change="true"
    :disabled="props.isDisabled || props.isReadonly"
    :format-options="props.formatOptions ?? undefined"
    :step="props.step"
    :step-snapping="true"
    :as-child="false"
    :locale="effectiveLocale"
    :name="props.name ?? undefined"
    :max="props.max ?? undefined"
    :min="props.min ?? undefined"
  >
    <InlineFieldWrapper
      :id="id"
      :is-error="isError"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :is-loading="props.isLoading"
      :error-message="props.errorMessage"
      :label="props.label"
      :variant="props.variant"
      :icon-left="props.iconLeft"
      :icon-right="props.iconRight"
      :class="props.class"
      :style="props.style"
    >
      <template #left>
        <slot name="left" />
      </template>

      <template #right>
        <slot name="right" />
      </template>

      <RekaNumberFieldInput
        :aria-describedby="ariaDescribedBy"
        :aria-required="ariaRequired"
        :aria-busy="ariaBusy"
        :aria-invalid="ariaInvalid"
        :autocomplete="props.autocomplete ?? undefined"
        :placeholder="props.placeholder ?? undefined"
        :class="inlineNumberFieldStyle.input()"
        data-field-wrapper
        @input="onInput"
        @keydown.enter="onEnterKeyDown"
        @focus.prevent
        @blur="onBlur"
      />
    </InlineFieldWrapper>
  </RekaNumberFieldRoot>
</template>
