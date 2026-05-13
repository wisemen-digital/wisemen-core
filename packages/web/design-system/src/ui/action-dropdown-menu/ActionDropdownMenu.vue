<script setup lang="ts">
import type {
  Action,
  ActionModel,
} from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'

import ActionDropdownMenuContent from '@/ui/action-dropdown-menu/ActionDropdownMenuContent.vue'
import { UIDropdownMenu } from '@/ui/dropdown-menu/index'

const props = defineProps<{
  actions?: Action[]
  currentContextOnly: boolean
  metadata?: Record<string, unknown>
  models?: ActionModel[]
  parentAction?: Action
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
  required: false,
})

if (!props.currentContextOnly) {
  useTemporaryActions(props.actions ?? [], GroupPriority.VIEW)
  useTemporaryActions(props.parentAction ?? [], GroupPriority.VIEW)
}
</script>

<template>
  <UIDropdownMenu v-model:is-open="isOpen">
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <ActionDropdownMenuContent
        :metadata="props.metadata"
        :actions="props.actions ?? []"
        :parent-action="props.parentAction"
        :models="props.models ?? []"
      />
    </template>
  </UIDropdownMenu>
</template>
