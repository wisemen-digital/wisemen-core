<script setup lang="ts">
import { computed } from 'vue'

import type { CustomComponentVariant } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideTextareaContext } from '@/components/textarea/textarea.context'
import type { TextareaEmits } from '@/components/textarea/textarea.emits'
import type { TextareaProps } from '@/components/textarea/textarea.props'
import type { CreateTextareaStyle } from '@/components/textarea/textarea.style'
import { createTextareaStyle } from '@/components/textarea/textarea.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<TextareaProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isRequired: false,
  isSpellCheckEnabled: false,
  isTouched: false,
  autocomplete: 'off',
  classConfig: null,
  errorMessage: null,
  hint: null,
  label: null,
  placeholder: null,
  resize: 'none',
  variant: null,
})

const emit = defineEmits<TextareaEmits>()

const modelValue = defineModel<string | null>({
  required: true,
})

const {
  theme,
} = injectThemeProviderContext()

const textareaStyle = computed<CreateTextareaStyle>(() => createTextareaStyle({
  variant: props.variant ?? undefined,
}))

const customClassConfig = computed<CustomComponentVariant<'textarea'>>(
  () => getCustomComponentVariant('textarea', theme.value, {
    variant: props.variant,
  }),
)

function onBlur(event: FocusEvent): void {
  emit('blur', event)
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
}

useProvideTextareaContext({
  ...toComputedRefs(props),
  customClassConfig,
  modelValue,
  style: textareaStyle,
  onBlur,
  onFocus,
})
</script>

<template>
  <div
    :class="textareaStyle.root({
      class: mergeClasses(customClassConfig.root, props.classConfig?.root),
    })"
    :data-invalid="(props.errorMessage !== null && props.isTouched) || undefined"
    :data-disabled="props.isDisabled || undefined"
    :data-resize="props.resize"
  >
    <slot />
  </div>
</template>
