<script setup lang="ts">
import {
  TooltipContent as RekaTooltipContent,
  TooltipPortal as RekaTooltipPortal,
  TooltipRoot as RekaTooltipRoot,
  TooltipTrigger as RekaTooltipTrigger,
} from 'reka-ui'
import { computed } from 'vue'

import { POPPER_PROPS_DEFAULTS } from '@/types/popper.type'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'
import type { TooltipProps } from '@/ui/tooltip/tooltip.props'
import type { TooltipStyle } from '@/ui/tooltip/tooltip.style'
import { createTooltipStyle } from '@/ui/tooltip/tooltip.style'
import TooltipArrow from '@/ui/tooltip/TooltipArrow.vue'

const props = withDefaults(defineProps<TooltipProps>(), {
  ...POPPER_PROPS_DEFAULTS,
  isDisabled: false,
  delayDuration: 300,
  disableCloseOnTriggerClick: false,
  disableHoverableContent: false,
})

const tooltipStyle = computed<TooltipStyle>(() => createTooltipStyle({
  popoverWidth: props.popoverWidth ?? undefined,
}))

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})
</script>

<template>
  <RekaTooltipRoot
    v-model:open="isOpen"
    :delay-duration="props.delayDuration"
    :disable-closing-trigger="props.disableCloseOnTriggerClick"
    :disable-hoverable-content="props.disableHoverableContent"
    :disabled="props.isDisabled"
    :ignore-non-keyboard-focus="true"
  >
    <RekaTooltipTrigger
      :as-child="true"
      :reference="props.popoverAnchorReferenceElement ?? undefined"
    >
      <slot name="trigger" />
    </RekaTooltipTrigger>

    <RekaTooltipPortal to="body">
      <ThemeProvider :as-child="true">
        <RekaTooltipContent
          :align="props.popoverAlign"
          :align-offset="props.popoverAlignOffset"
          :collision-padding="props.popoverCollisionPadding"
          :collision-boundary="props.popoverContainerElement"
          :side="props.popoverSide"
          :side-offset="props.popoverSideOffset"
          :class="tooltipStyle.contentWrapper()"
          :data-animation="props.popoverAnimationName ?? 'tooltip-default'"
          position-strategy="absolute"
          sticky="always"
        >
          <div
            :class="tooltipStyle.content()"
          >
            <slot name="content" />
          </div>

          <TooltipArrow v-if="props.isPopoverArrowVisible" />
        </RekaTooltipContent>
      </ThemeProvider>
    </RekaTooltipPortal>
  </RekaTooltipRoot>
</template>

<style>
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    filter: blur(2px);
  }
}

@keyframes tooltipFadeOut {
  to {
    opacity: 0;
    filter: blur(2px);
  }
}

[data-animation='tooltip-default'][data-state='delayed-open'] {
  animation: tooltipFadeIn 150ms ease-in-out;
}

[data-animation='tooltip-default'][data-state='closed'] {
  animation: tooltipFadeOut 150ms ease-in-out;
}
</style>
