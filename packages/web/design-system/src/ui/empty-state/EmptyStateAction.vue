<script setup lang="ts">
import {
  UIButton,
  UILink,
} from '@/ui/button'
import type { EmptyStateAction } from '@/ui/empty-state/emptyState.props'

const props = withDefaults(defineProps<{
  action: EmptyStateAction
  variant?: 'primary' | 'secondary'
}>(), {
  variant: 'primary',
})
</script>

<template>
  <UIButton
    v-if="props.action.type === 'button'"
    v-bind="props.action"
    :variant="props.variant"
    @click="props.action.onClick"
  />

  <UILink
    v-else-if="props.action.type === 'link'"
    v-bind="props.action"
    :variant="props.variant"
  />

  <!-- TODO: add when ActionTrigger component is added -->
  <!-- <ActionTrigger
    v-else-if="props.action.type === 'Action'"
    :action="props.action.action"
  /> -->
  <div
    v-else-if="props.action.type === 'Action'"
  />
</template>
