<script setup lang="ts">
import {
  MinusIcon,
  PlusIcon,
} from '@wisemen/vue-core-icons'
import {
  NumberFieldDecrement as RekaNumberFieldDecrement,
  NumberFieldIncrement as RekaNumberFieldIncrement,
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
import { useI18n } from 'vue-i18n'

import { useInput } from '@/composables/input.composable'
import {
  formatNumberDecimalSeparators,
  useNumberFieldLocale,
} from '@/composables/numberField.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import IconButton from '@/ui/button/icon/IconButton.vue'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { NumberFieldProps } from '@/ui/number-field/numberField.props'
import type { NumberFieldStyle } from '@/ui/number-field/numberField.style'
import { createNumberFieldStyle } from '@/ui/number-field/numberField.style'
import { UIRowLayout } from '@/ui/row-layout/index'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<NumberFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  formatOptions: null,
  max: null,
  min: null,
  showControls: false,
  step: 1,
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
}>()

const modelValue = defineModel<number | null>({
  required: true,
})

const numberFieldStyle = computed<NumberFieldStyle>(() => createNumberFieldStyle({
  showControls: props.showControls,
}))

// Since reka-ui's NumberField component only updates the modelValue on blur or enter key press,
// we need to keep a copied version of the modelValue to reflect changes immediately.
const copiedModelValue = ref<number | null>(modelValue.value)
const isEditing = ref<boolean>(false)

// this is necessary because otherwise the input will not update when the modelValue is changed programmatically
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

const i18n = useI18n()

const id = props.id ?? useId()
const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
} = useInput(id, props)

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
      <FieldWrapper
        :icon-left="props.iconLeft"
        :icon-right="props.iconRight"
        :is-loading="props.isLoading"
        :is-error="isError"
        :is-disabled="props.isDisabled"
        :is-readonly="props.isReadonly"
      >
        <template #left>
          <slot name="left">
            <UIRowLayout
              v-if="props.showControls"
              :class="numberFieldStyle.leftControl()"
              align="center"
            >
              <RekaNumberFieldDecrement :as-child="true">
                <IconButton
                  :is-tooltip-disabled="true"
                  :is-disabled="props.isDisabled || props.isReadonly || props.min === copiedModelValue"
                  :icon="MinusIcon"
                  :label="i18n.t('component.number_field.decrement')"
                  variant="tertiary"
                  size="xs"
                />
              </RekaNumberFieldDecrement>
            </UIRowLayout>
          </slot>
        </template>

        <template #right>
          <slot name="right">
            <UIRowLayout
              v-if="props.showControls"
              :class="numberFieldStyle.rightControl()"
              align="center"
            >
              <RekaNumberFieldIncrement :as-child="true">
                <IconButton
                  :is-tooltip-disabled="true"
                  :is-disabled="props.isDisabled || props.isReadonly || props.max === copiedModelValue"
                  :icon="PlusIcon"
                  :label="i18n.t('component.number_field.increment')"
                  variant="tertiary"
                  size="xs"
                />
              </RekaNumberFieldIncrement>
            </UIRowLayout>
          </slot>
        </template>

        <RekaNumberFieldInput
          :aria-describedby="ariaDescribedBy"
          :aria-required="props.isRequired"
          :autocomplete="props.autocomplete ?? undefined"
          :aria-busy="ariaBusy"
          :aria-invalid="ariaInvalid"
          :placeholder="props.placeholder ?? undefined"
          :class="numberFieldStyle.input()"
          data-field-wrapper
          @input="onInput"
          @keydown.enter="onEnterKeyDown"
          @focus.prevent
          @blur="onBlur"
        />
      </FieldWrapper>
    </RekaNumberFieldRoot>
  </InputWrapper>
</template>
