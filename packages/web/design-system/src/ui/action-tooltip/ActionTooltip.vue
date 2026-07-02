<script setup lang="ts">
import { computed } from 'vue'

import type { ActionTooltipProps } from '@/ui/action-tooltip/actionTooltip.props'
import KeyboardShortcut from '@/ui/keyboard-shortcut/KeyboardShortcut.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import Tooltip from '@/ui/tooltip/Tooltip.vue'
import TooltipContent from '@/ui/tooltip/TooltipContent.vue'
import TooltipText from '@/ui/tooltip/TooltipText.vue'

const props = withDefaults(defineProps<ActionTooltipProps>(), {
  isCloseOnTriggerClickDisabled: false,
  isDisabled: false,
  keyboardShortcut: null,
  label: null,
  popoverAlign: 'center',
  popoverSide: 'top',
})

const isCloseOnTriggerClickDisabled = computed<boolean>(
  () => props.isCloseOnTriggerClickDisabled || props.disableCloseOnTriggerClick === true,
)
</script>

<template>
  <Tooltip
    :is-disabled="props.isDisabled"
    :popover-side="props.popoverSide ?? undefined"
    :is-hoverable-content-disabled="true"
    :popover-side-offset="4"
    :popover-align="props.popoverAlign"
    :is-close-on-trigger-click-disabled="isCloseOnTriggerClickDisabled"
  >
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <TooltipContent>
        <RowLayout gap="sm">
          <TooltipText
            v-if="props.label !== null"
            :text="props.label"
          />

          <KeyboardShortcut
            v-if="props.keyboardShortcut !== null"
            :keyboard-shortcut="props.keyboardShortcut"
            :is-key-hold-visualization-enabled="true"
          />
        </RowLayout>
      </TooltipContent>
    </template>
  </Tooltip>
</template>
