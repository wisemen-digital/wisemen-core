<script setup lang="ts">
import { NumberFieldRoot as RekaNumberFieldRoot } from 'reka-ui'
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideNumberFieldContext } from '@/components/number-field/numberField.context'
import type { NumberFieldEmits } from '@/components/number-field/numberField.emits'
import type { NumberFieldProps } from '@/components/number-field/numberField.props'
import type { CreateNumberFieldStyle } from '@/components/number-field/numberField.style'
import { createNumberFieldStyle } from '@/components/number-field/numberField.style'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<NumberFieldProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isLoading: false,
  isRequired: false,
  isTouched: false,
  autocomplete: 'off',
  classConfig: null,
  errorMessage: null,
  formatOptions: null,
  hideControls: false,
  hint: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  max: null,
  min: null,
  placeholder: null,
  step: 1,
  variant: null,
})

const emit = defineEmits<NumberFieldEmits>()

const modelValue = defineModel<number | null>({
  required: true,
})

const locale = navigator.language

const delegatedModel = computed<number | undefined>({
  get: () => modelValue.value ?? undefined,
  set: (value: number | undefined) => {
    if (Number.isNaN(value)) {
      modelValue.value = null

      return
    }

    modelValue.value = value ?? null
  },
})

const {
  theme,
} = injectThemeProviderContext()

const numberFieldStyle = computed<CreateNumberFieldStyle>(
  () => createNumberFieldStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'numberField'>>(
  () => getCustomComponentVariant('numberField', theme.value, {
    variant: props.variant,
  }),
)

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

useProvideNumberFieldContext({
  ...toComputedRefs(props),
  customClassConfig,
  style: numberFieldStyle,
  onBlur,
  onFocus,
})
</script>

<template>
  <InteractableElement :is-disabled="props.isDisabled">
    <RekaNumberFieldRoot
      v-model="delegatedModel"
      :class="numberFieldStyle.root({
        class: mergeClasses(customClassConfig.root, props.classConfig?.root),
      })"
      :data-icon-left="props.iconLeft !== null || undefined"
      :data-icon-right="props.iconRight !== null || undefined"
      :data-invalid="(props.errorMessage !== null && props.isTouched) || undefined"
      :data-controls="!props.hideControls || undefined"
      :required="props.isRequired"
      :min="props.min ?? undefined"
      :max="props.max ?? undefined"
      :step="props.step"
      :format-options="props.formatOptions ?? undefined"
      :locale="locale"
    >
      <slot />
    </RekaNumberFieldRoot>
  </InteractableElement>
</template>
