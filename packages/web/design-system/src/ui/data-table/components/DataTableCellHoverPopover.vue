<script setup lang="ts">
import { useIsTouchDevice } from '@/composables/useIsTouchDevice.composable'
import { UIPopover } from '@/ui/popover'
import { UITooltip } from '@/ui/tooltip'

withDefaults(defineProps<{
  isOpen?: boolean
  popoverAlign?: 'center' | 'end' | 'start'
  popoverSide?: 'bottom' | 'left' | 'right' | 'top'
}>(), {
  isOpen: false,
  popoverAlign: 'center',
  popoverSide: 'bottom',
})

const emit = defineEmits<{
  'update:isOpen': [isOpen: boolean]
}>()

const isTouchDevice = useIsTouchDevice()
</script>

<template>
  <UIPopover
    v-if="isTouchDevice"
    :is-open="isOpen"
    :popover-align="popoverAlign"
    :popover-side="popoverSide"
    @update:is-open="(value) => emit('update:isOpen', value)"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>

    <template #content>
      <slot name="content" />
    </template>
  </UIPopover>

  <UITooltip
    v-else
    :popover-align="popoverAlign"
    :popover-side="popoverSide"
    :is-hoverable-content-disabled="false"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>

    <template #content>
      <slot name="content" />
    </template>
  </UITooltip>
</template>
