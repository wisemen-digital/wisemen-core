<script setup lang="ts" generic="TValue extends string">
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideTextFieldContext } from '@/components/text-field/textField.context'
import type {
  TextFieldEmits,
  TextFieldProps,
} from '@/components/text-field/textField.props'
import type { CreateTextFieldStyle } from '@/components/text-field/textField.style'
import { createTextFieldStyle } from '@/components/text-field/textField.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<TextFieldProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isLoading: false,
  isRequired: false,
  isSpellCheckEnabled: false,
  isTouched: false,
  autocomplete: 'off',
  classConfig: null,
  errorMessage: null,
  hint: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  placeholder: null,
  type: 'text',
  variant: null,
})

const emit = defineEmits<TextFieldEmits>()

const modelValue = defineModel<TValue | null>({
  required: true,
})

const {
  theme,
} = injectThemeProviderContext()

const textFieldStyle = computed<CreateTextFieldStyle>(
  () => createTextFieldStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'textField'>>(
  () => getCustomComponentVariant('textField', theme.value, {
    variant: props.variant,
  }),
)

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

useProvideTextFieldContext({
  ...toComputedRefs(props),
  customClassConfig,
  modelValue,
  style: textFieldStyle,
  onBlur,
  onFocus,
})
</script>

<template>
  <div
    :class="textFieldStyle.root({
      class: mergeClasses(customClassConfig.root, props.classConfig?.root),
    })"
    :data-icon-left="props.iconLeft !== null || undefined"
    :data-icon-right="props.iconRight !== null || undefined"
    :data-invalid="(props.errorMessage !== null && props.isTouched) || undefined"
    :data-disabled="props.isDisabled || undefined"
  >
    <slot />
  </div>
</template>
