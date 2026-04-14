<script setup lang="ts">
import type { ButtonProps } from '@/ui/button/button/button.props'
import Button from '@/ui/button/button/Button.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isLoading?: boolean
  disabledReason?: ButtonProps['disabledReason']
  keyboardShortcut?: ButtonProps['keyboardShortcut']
  label?: string
  size?: ButtonProps['size']
  tooltipLabel?: ButtonProps['tooltipLabel']
  tooltipSide?: ButtonProps['tooltipSide']
  type?: ButtonProps['type']
  variant?: ButtonProps['variant']
}>(), {
  isDisabled: false,
  isLoading: false,
  disabledReason: undefined,
  keyboardShortcut: undefined,
  label: 'Button',
  size: 'md',
  tooltipLabel: undefined,
  tooltipSide: 'top',
  type: 'button',
  variant: 'primary',
})
</script>

<template>
  <div>
    <Button
      :disabled-reason="props.disabledReason"
      :is-disabled="props.isDisabled"
      :is-loading="props.isLoading"
      :keyboard-shortcut="props.keyboardShortcut"
      :label="props.label"
      :size="props.size"
      :tooltip-label="props.tooltipLabel"
      :tooltip-side="props.tooltipSide"
      :type="props.type"
      :variant="props.variant"
    />
  </div>
</template>
