<script setup lang="ts">
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideFormFieldContext } from '@/components/form-field/formField.context'
import type { FormFieldProps } from '@/components/form-field/formField.props'
import type { CreateFormFieldStyle } from '@/components/form-field/formField.style'
import { createFormFieldStyle } from '@/components/form-field/formField.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<FormFieldProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isRequired: false,
  isTouched: false,
  classConfig: null,
  errorMessage: null,
  hint: null,
  label: null,
  layout: 'vertical',
  variant: null,
})

const {
  theme,
} = injectThemeProviderContext()

const formFieldStyle = computed<CreateFormFieldStyle>(
  () => createFormFieldStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'formField'>>(
  () => getCustomComponentVariant('formField', theme.value, {
    variant: props.variant,
  }),
)

useProvideFormFieldContext({
  ...toComputedRefs(props),
  customClassConfig,
  style: formFieldStyle,
})
</script>

<template>
  <div
    :data-layout="props.layout"
    :class="formFieldStyle.root({
      class: mergeClasses(customClassConfig.root, props.classConfig?.root),
    })"
  >
    <slot />
  </div>
</template>
