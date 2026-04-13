<script setup lang="ts">
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import { useProvideIconButtonContext } from '@/components/button/icon-button/iconButton.context'
import type { IconButtonProps } from '@/components/button/icon-button/iconButton.props'
import type { CreateIconButtonStyle } from '@/components/button/icon-button/iconButton.style'
import { createIconButtonStyle } from '@/components/button/icon-button/iconButton.style'
import type { ButtonEmits } from '@/components/button/shared/sharedButton.props'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<IconButtonProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isLoading: false,
  classConfig: null,
  size: 'md',
  type: 'button',
  variant: 'primary',
})

const emit = defineEmits<ButtonEmits>()

const {
  theme,
} = injectThemeProviderContext()

const buttonStyle = computed<CreateIconButtonStyle>(() => createIconButtonStyle({
  size: props.size,
  variant: props.variant,
}))

const customClassConfig = computed<ResolvedClassConfig<'iconButton'>>(
  () => getCustomComponentVariant('iconButton', theme.value, {
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

useProvideIconButtonContext({
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
      <span class="sr-only">
        {{ props.label }}
      </span>

      <slot />
    </InteractableElement>
  </TestIdProvider>
</template>
