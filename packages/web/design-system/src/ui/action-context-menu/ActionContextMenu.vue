<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'

import type { RegisteredActionContext } from '@/register'
import ActionContextMenuContent from '@/ui/action-context-menu/ActionContextMenuContent.vue'
import { UIContextMenu } from '@/ui/context-menu/index'

const props = withDefaults(defineProps<{
  isCurrentContextOnly: boolean
  actions?: Action[]
  /**
   * @deprecated Use `isCurrentContextOnly` instead.
   */
  currentContextOnly?: boolean
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  parentAction?: Action
}>(), {
  currentContextOnly: undefined,
})

const emit = defineEmits<{
  open: []
}>()

const isCurrentContextOnly = props.isCurrentContextOnly || props.currentContextOnly === true

if (!isCurrentContextOnly) {
  useTemporaryActions(props.actions ?? [], GroupPriority.VIEW)
  useTemporaryActions(props.parentAction ?? [], GroupPriority.VIEW)
}
</script>

<template>
  <UIContextMenu @open="emit('open')">
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <ActionContextMenuContent
        :metadata="props.metadata"
        :actions="props.actions ?? []"
        :parent-action="props.parentAction"
        :models="props.models ?? []"
      >
        <template #bottom>
          <slot name="bottom" />
        </template>
      </ActionContextMenuContent>
    </template>
  </UIContextMenu>
</template>
