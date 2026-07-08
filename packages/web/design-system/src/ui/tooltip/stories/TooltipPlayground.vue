<script setup lang="ts">
import Button from '@/ui/button/button/Button.vue'
import type { TooltipProps } from '@/ui/tooltip/tooltip.props'
import Tooltip from '@/ui/tooltip/Tooltip.vue'

const props = withDefaults(defineProps<{
  isCloseOnTriggerClickDisabled?: boolean
  isDisabled?: boolean
  isHoverableContentDisabled?: boolean
  isPopoverArrowVisible?: boolean
  delayDuration?: number
  popoverAlign?: TooltipProps['popoverAlign']
  popoverSide?: TooltipProps['popoverSide']
}>(), {
  isCloseOnTriggerClickDisabled: false,
  isDisabled: false,
  isHoverableContentDisabled: false,
  isPopoverArrowVisible: false,
  delayDuration: undefined,
  popoverAlign: 'center',
  popoverSide: 'top',
})
</script>

<template>
  <Tooltip
    :delay-duration="props.delayDuration"
    :is-close-on-trigger-click-disabled="props.isCloseOnTriggerClickDisabled"
    :is-hoverable-content-disabled="props.isHoverableContentDisabled"
    :is-disabled="props.isDisabled"
    :is-popover-arrow-visible="props.isPopoverArrowVisible"
    :popover-align="props.popoverAlign"
    :popover-side="props.popoverSide"
    :popover-side-offset="4"
  >
    <template #trigger>
      <Button label="Hover me" />
    </template>
    <template #content>
      <div class="flex px-sm py-xs">
        <p class="flex max-w-xs text-center text-xs text-secondary">
          What a beautiful tooltip!
        </p>
      </div>
    </template>
  </Tooltip>
</template>
