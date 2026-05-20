<script setup lang="ts">
import type { Action } from '@wisemen/vue-core-actions'
import {
  GroupPriority,
  useTemporaryActions,
} from '@wisemen/vue-core-actions'

import type { RegisteredActionContext } from '@/register'
import ActionContextMenuContent from '@/ui/action-context-menu/ActionContextMenuContent.vue'
import { UIContextMenu } from '@/ui/context-menu/index'

const props = defineProps<{
  actions?: Action[]
  currentContextOnly: boolean
  metadata?: RegisteredActionContext['metadata']
  models?: RegisteredActionContext['models']
  parentAction?: Action
}>()

if (!props.currentContextOnly) {
  useTemporaryActions(props.actions ?? [], GroupPriority.VIEW)
  useTemporaryActions(props.parentAction ?? [], GroupPriority.VIEW)
}
</script>

<template>
  <UIContextMenu>
    <template #trigger>
      <slot />
    </template>

    <template #content>
      <ActionContextMenuContent
        :metadata="props.metadata"
        :actions="props.actions ?? []"
        :parent-action="props.parentAction"
        :models="props.models ?? []"
      />
    </template>
  </UIContextMenu>
</template>
