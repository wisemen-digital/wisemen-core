<script setup lang="ts">
import {
  injectTooltipProviderContext,
  TooltipRoot as RekaTooltipRoot,
} from 'reka-ui'
import {
  computed,
  ref,
  watch,
} from 'vue'

import type { CustomComponentVariant } from '@/class-variant/classVariant.type'
import { getCustomComponentVariant } from '@/class-variant/customClassVariants'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import { useProvideTooltipContext } from '@/components/tooltip/tooltip.context'
import type { TooltipProps } from '@/components/tooltip/tooltip.props'
import type { CreateTooltipStyle } from '@/components/tooltip/tooltip.style'
import { createTooltipStyle } from '@/components/tooltip/tooltip.style'
import { toComputedRefs } from '@/utils/props.util'

const props = withDefaults(defineProps<TooltipProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isPopoverArrowHidden: false,
  classConfig: null,
  closeOnTriggerClick: false,
  delayDuration: 200,
  disableCloseOnTriggerClick: false,
  disableHoverableContent: false,
  popoverAlign: 'center',
  popoverAlignOffset: 0,
  popoverAnchorReferenceElement: null,
  popoverCollisionPadding: 10,
  popoverContainerElement: null,
  popoverSide: 'top',
  popoverSideOffset: 10,
  popoverWidth: null,
  variant: null,
})

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

const {
  theme,
} = injectThemeProviderContext()

const {
  isOpenDelayed,
} = injectTooltipProviderContext()

const isInitialAnimationEnabled = ref<boolean>(true)

watch(isOpenDelayed, (isOpenDelayed) => {
  if (isOpenDelayed) {
    isInitialAnimationEnabled.value = true
  }
  else {
    // Delay disabling the animation to allow the enter animation to play
    setTimeout(() => {
      isInitialAnimationEnabled.value = isOpenDelayed
    }, 100)
  }
})

const tooltipStyle = computed<CreateTooltipStyle>(() => createTooltipStyle({
  variant: props.variant ?? undefined,
}))

const customClassConfig = computed<CustomComponentVariant<'tooltip'>>(
  () => getCustomComponentVariant('tooltip', theme.value, {
    variant: props.variant,
  }),
)

useProvideTooltipContext({
  ...toComputedRefs(props),
  isInitialAnimationEnabled: computed<boolean>(() => isInitialAnimationEnabled.value),
  isOpen: computed<boolean>(() => isOpen.value),
  customClassConfig,
  style: tooltipStyle,
})
</script>

<template>
  <RekaTooltipRoot
    v-model:open="isOpen"
    :delay-duration="props.delayDuration"
    :disable-hoverable-content="props.disableHoverableContent"
    :disable-closing-trigger="props.disableCloseOnTriggerClick"
    :disabled="props.isDisabled"
    :ignore-non-keyboard-focus="true"
  >
    <slot />
  </RekaTooltipRoot>
</template>
