<script setup lang="ts">
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideButtonContext } from '@/components/button/default-button/button.context'
import type { ButtonProps } from '@/components/button/default-button/button.props'
import type { CreateButtonStyle } from '@/components/button/default-button/button.style'
import { createButtonStyle } from '@/components/button/default-button/button.style'
import type { ButtonEmits } from '@/components/button/shared/sharedButton.props'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<ButtonProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isLoading: false,
  classConfig: null,
  iconLeft: null,
  iconRight: null,
  size: 'md',
  type: 'button',
  variant: 'primary',
})

const emit = defineEmits<ButtonEmits>()

const {
  theme,
} = injectThemeProviderContext()

const buttonStyle = computed<CreateButtonStyle>(() => createButtonStyle({
  size: props.size,
  variant: props.variant,
}))

const customClassConfig = computed<ResolvedClassConfig<'button'>>(
  () => getCustomComponentVariant('button', theme.value, {
    size: props.size,
    variant: props.variant,
  }),
)

function onClick(event: MouseEvent): void {
  if (props.isLoading) {
    return
  }

  emit('click', event)
}

useProvideButtonContext({
  ...toComputedRefs(props),
  customClassConfig,
  style: buttonStyle,
})
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement
      :is-disabled="props.isDisabled"
      :aria-disabled="props.isLoading"
      :aria-busy="props.isLoading"
      :type="props.type"
      :data-loading="props.isLoading"
      :class="buttonStyle.root({
        class: mergeClasses(customClassConfig.root, props.classConfig?.root),
      })"
      as="button"
      @click="onClick"
    >
      <slot />
    </InteractableElement>
  </TestIdProvider>
</template>
