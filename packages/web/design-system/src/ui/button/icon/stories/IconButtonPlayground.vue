<script setup lang="ts">
import { Settings01Icon } from '@wisemen/vue-core-icons'

import type { IconButtonProps } from '@/ui/button/icon/iconButton.props'
import IconButton from '@/ui/button/icon/IconButton.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  isTooltipDisabled?: boolean
  keyboardShortcut?: IconButtonProps['keyboardShortcut']
  label?: string
  size?: IconButtonProps['size']
  tooltipLabel?: IconButtonProps['tooltipLabel']
  type?: IconButtonProps['type']
  variant?: IconButtonProps['variant']
}>(), {
  isDisabled: false,
  isLoading: false,
  isTooltipDisabled: false,
  keyboardShortcut: undefined,
  label: 'Settings',
  size: 'md',
  tooltipLabel: undefined,
  type: 'button',
  variant: 'primary',
})
</script>

<template>
  <div>
    <IconButton
      :icon="Settings01Icon"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :is-tooltip-disabled="props.isTooltipDisabled"
      :keyboard-shortcut="props.keyboardShortcut"
      :label="props.label"
      :size="props.size"
      :tooltip-label="props.tooltipLabel"
      :type="props.type"
      :variant="props.variant"
    />
  </div>
</template>
