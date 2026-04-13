<script setup lang="ts">
import { SwitchRoot as RekaSwitchRoot } from 'reka-ui'
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import FormControl from '@/components/shared/FormControl.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useProvideSwitchContext } from '@/components/switch/switch.context'
import type { SwitchEmits } from '@/components/switch/switch.emits'
import type { SwitchProps } from '@/components/switch/switch.props'
import type { CreateSwitchStyle } from '@/components/switch/switch.style'
import { createSwitchStyle } from '@/components/switch/switch.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<SwitchProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isRequired: false,
  isTouched: false,
  classConfig: null,
  errorMessage: null,
  hint: null,
  iconChecked: null,
  iconUnchecked: null,
  label: null,
  size: 'md',
  variant: null,
})

const emit = defineEmits<SwitchEmits>()

const modelValue = defineModel<boolean>({
  required: true,
})

const {
  theme,
} = injectThemeProviderContext()

const switchStyle = computed<CreateSwitchStyle>(() => createSwitchStyle({
  size: props.size,
  variant: props.variant ?? undefined,
}))

const customClassConfig = computed<ResolvedClassConfig<'switch'>>(
  () => getCustomComponentVariant('switch', theme.value, {
    size: props.size,
    variant: props.variant,
  }),
)

useProvideSwitchContext({
  ...toComputedRefs(props),
  isChecked: computed<boolean>(() => modelValue.value),
  customClassConfig,
  style: switchStyle,
})
</script>

<template>
  <TestIdProvider :test-id="testId">
    <FormControl
      :id="id"
      :is-disabled="isDisabled"
      :is-invalid="errorMessage !== null"
      :is-required="isRequired"
      :described-by="`${id}-error ${id}-hint`"
      :is-loading="false"
    >
      <RekaSwitchRoot
        v-model="modelValue"
        :data-invalid="(errorMessage !== null && props.isTouched) || undefined"
        :class="switchStyle.root({
          class: mergeClasses(customClassConfig.root, props.classConfig?.root),
        })"
        @focus="emit('focus')"
        @blur="emit('blur')"
      >
        <slot />
      </RekaSwitchRoot>
    </FormControl>
  </TestIdProvider>
</template>
