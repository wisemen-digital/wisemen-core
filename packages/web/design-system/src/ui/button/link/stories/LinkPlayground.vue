<script setup lang="ts">
import { User01Icon } from '@wisemen/vue-core-icons'

import type { LinkProps } from '@/ui/button/link/link.props'
import Link from '@/ui/button/link/Link.vue'

const props = withDefaults(defineProps<{
  keyboardShortcut?: LinkProps['keyboardShortcut']
  label?: string
  size?: LinkProps['size']
  tooltipLabel?: LinkProps['tooltipLabel']
  tooltipSide?: LinkProps['tooltipSide']
  variant?: LinkProps['variant']
}>(), {
  keyboardShortcut: undefined,
  label: 'Link',
  size: 'md',
  tooltipLabel: undefined,
  tooltipSide: 'top',
  variant: 'primary',
})
</script>

<template>
  <Link
    :keyboard-shortcut="props.keyboardShortcut"
    :icon-left="User01Icon"
    :label="props.label"
    :link="{ href: '#' }"
    :size="props.size"
    :tooltip-label="props.tooltipLabel"
    :tooltip-side="props.tooltipSide"
    :variant="props.variant"
  />
</template>
